import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePaymentSessionDto } from './dto/create-payment-session.dto';
import { PaymentWebhookDto } from './dto/payment-webhook.dto';
import {
  BookingStatus,
  PaymentProvider,
  PaymentStatus,
  WalletTransactionType,
} from '@prisma/client';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createPaymentSession(userId: string, dto: CreatePaymentSessionDto) {
    const { bookingId, provider, idempotencyKey } = dto;

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        trip: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Bron topilmadi');
    }

    if (booking.passengerId !== userId) {
      throw new BadRequestException('Ushbu bron uchun to`lov faqat yo`lovchi tomonidan amalga oshirilishi mumkin');
    }

    if (booking.status !== BookingStatus.PENDING_PAYMENT) {
      throw new BadRequestException(`Ushbu bron to\`lov uchun yaroqsiz holatda (${booking.status})`);
    }

    if (new Date() > booking.paymentExpiresAt) {
      throw new BadRequestException('To`lov kutish muddati tugagan (10 daqiqa). Iltimos, qayta bron qiling');
    }

    // Check for existing payment with this idempotency key
    const existing = await this.prisma.payment.findUnique({
      where: { idempotencyKey },
    });

    if (existing) {
      if (existing.status === PaymentStatus.COMPLETED) {
        return {
          paymentId: existing.id,
          status: existing.status,
          alreadyPaid: true,
          amount: existing.amount,
          currency: existing.currency,
        };
      }
      return {
        paymentId: existing.id,
        status: existing.status,
        checkoutUrl: this.buildCheckoutUrl(existing.id, provider, Number(existing.amount)),
        amount: existing.amount,
        currency: existing.currency,
      };
    }

    const payment = await this.prisma.payment.create({
      data: {
        bookingId,
        provider,
        amount: booking.totalPrice,
        currency: booking.trip.currency,
        status: PaymentStatus.PENDING,
        idempotencyKey,
      },
    });

    this.logger.log(`Payment session created: ${payment.id} for booking ${bookingId}`);

    return {
      paymentId: payment.id,
      provider: payment.provider,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      checkoutUrl: this.buildCheckoutUrl(payment.id, provider, Number(payment.amount)),
    };
  }

  async processWebhook(
    provider: PaymentProvider,
    payload: PaymentWebhookDto,
    idempotencyKeyHeader?: string,
  ) {
    const idempotencyKey = payload.idempotencyKey || idempotencyKeyHeader;

    this.logger.log(`Received webhook from ${provider}: ${JSON.stringify(payload)}`);

    return this.prisma.$transaction(async (tx) => {
      // Find payment by paymentId, idempotencyKey, or bookingId
      let payment = null;

      if (payload.paymentId) {
        payment = await tx.payment.findUnique({
          where: { id: payload.paymentId },
          include: {
            booking: {
              include: {
                trip: {
                  include: { driver: true },
                },
              },
            },
          },
        });
      } else if (idempotencyKey) {
        payment = await tx.payment.findUnique({
          where: { idempotencyKey },
          include: {
            booking: {
              include: {
                trip: {
                  include: { driver: true },
                },
              },
            },
          },
        });
      } else if (payload.bookingId) {
        payment = await tx.payment.findFirst({
          where: { bookingId: payload.bookingId, provider },
          orderBy: { createdAt: 'desc' },
          include: {
            booking: {
              include: {
                trip: {
                  include: { driver: true },
                },
              },
            },
          },
        });
      }

      if (!payment) {
        throw new NotFoundException('To`lov yozuvi topilmadi');
      }

      // Idempotency check: if already completed, return immediately without duplicate wallet credits!
      if (payment.status === PaymentStatus.COMPLETED) {
        this.logger.log(`Webhook already processed for payment ${payment.id} (Idempotent call)`);
        return {
          success: true,
          message: 'To`lov allaqachon muvaffaqiyatli yakunlangan',
          paymentId: payment.id,
          bookingId: payment.bookingId,
          status: PaymentStatus.COMPLETED,
        };
      }

      const providerTxId = payload.providerTxId || `mock_tx_${Date.now()}`;

      // 1. Update Payment status
      const updatedPayment = await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.COMPLETED,
          providerTxId,
        },
      });

      // 2. Update Booking status to CONFIRMED
      const booking = await tx.booking.update({
        where: { id: payment.bookingId },
        data: {
          status: BookingStatus.CONFIRMED,
        },
        include: {
          trip: {
            include: { driver: true },
          },
        },
      });

      // 3. Credit Driver Wallet in transaction
      const driverProfile = booking.trip.driver;
      const earnings = Number(booking.driverEarnings);
      const commission = Number(booking.commissionAmount);
      const currentBalance = Number(driverProfile.walletBalance);
      const newBalance = currentBalance + earnings;

      // Create EARNING transaction
      await tx.walletTransaction.create({
        data: {
          driverId: driverProfile.id,
          type: WalletTransactionType.EARNING,
          amount: earnings,
          balanceBefore: currentBalance,
          balanceAfter: newBalance,
          referenceId: booking.id,
          description: `Safar uchun to\`lov (${booking.trip.originCity} ➔ ${booking.trip.destinationCity})`,
        },
      });

      // Create COMMISSION transaction record for accounting transparency
      if (commission > 0) {
        await tx.walletTransaction.create({
          data: {
            driverId: driverProfile.id,
            type: WalletTransactionType.COMMISSION,
            amount: commission,
            balanceBefore: newBalance,
            balanceAfter: newBalance,
            referenceId: booking.id,
            description: 'OTAXI platforma xizmati komissiyasi (10%)',
          },
        });
      }

      // Update driver balance
      await tx.driverProfile.update({
        where: { id: driverProfile.id },
        data: {
          walletBalance: { increment: earnings },
        },
      });

      this.logger.log(
        `Payment ${payment.id} COMPLETED. Booking ${booking.id} CONFIRMED. Driver ${driverProfile.id} credited +${earnings} UZS`,
      );

      return {
        success: true,
        message: 'To`lov muvaffaqiyatli qabul qilindi va hisoblandi',
        paymentId: updatedPayment.id,
        bookingId: booking.id,
        status: PaymentStatus.COMPLETED,
      };
    });
  }

  async getPaymentById(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: {
          include: { trip: true },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('To`lov topilmadi');
    }

    return payment;
  }

  private buildCheckoutUrl(paymentId: string, provider: PaymentProvider, amount: number): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
    return `${baseUrl}/payments/checkout-mock?paymentId=${paymentId}&provider=${provider}&amount=${amount}`;
  }
}
