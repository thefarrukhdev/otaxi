import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus, TripStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createBooking(passengerId: string, dto: CreateBookingDto) {
    const { tripId, seatCount, pickupAddress, dropoffAddress, promoCode, passengerNotes } = dto;

    return this.prisma.$transaction(async (tx) => {
      // 1. Fetch trip and verify availability
      const trip = await tx.trip.findUnique({
        where: { id: tripId },
        include: { driver: true },
      });

      if (!trip) {
        throw new NotFoundException('Reys topilmadi');
      }

      if (trip.status !== TripStatus.PUBLISHED) {
        throw new BadRequestException('Ushbu reys hozirda bron qilish uchun ochiq emas');
      }

      if (trip.driver.userId === passengerId) {
        throw new BadRequestException('Haydovchi o`z reysini bron qila olmaydi');
      }

      if (trip.availableSeats < seatCount) {
        throw new BadRequestException(
          `Reysda yetarli bo\`sh joy mavjud emas. Qolgan bo\`sh joylar: ${trip.availableSeats}`,
        );
      }

      // 2. Concurrency-safe atomic seat decrement
      const remainingSeats = trip.availableSeats - seatCount;
      const newTripStatus = remainingSeats === 0 ? TripStatus.FULL : TripStatus.PUBLISHED;

      try {
        await tx.trip.update({
          where: {
            id: tripId,
            availableSeats: { gte: seatCount },
          },
          data: {
            availableSeats: { decrement: seatCount },
            status: newTripStatus,
          },
        });
      } catch {
        throw new BadRequestException('Afsuski, o`rindiqlar boshqa foydalanuvchi tomonidan band qilindi');
      }

      // 3. Price calculation & promo code validation
      const basePrice = Number(trip.pricePerSeat) * seatCount;
      let finalPrice = basePrice;
      let promoCodeId: string | null = null;

      if (promoCode) {
        const foundPromo = await tx.promoCode.findUnique({
          where: { code: promoCode.trim().toUpperCase() },
        });

        const now = new Date();
        if (
          foundPromo &&
          foundPromo.isActive &&
          foundPromo.validFrom <= now &&
          foundPromo.validTo >= now &&
          foundPromo.usedCount < foundPromo.usageLimit
        ) {
          promoCodeId = foundPromo.id;
          if (foundPromo.discountPercent) {
            finalPrice = basePrice * (1 - foundPromo.discountPercent / 100);
          } else if (foundPromo.fixedDiscount) {
            finalPrice = Math.max(0, basePrice - Number(foundPromo.fixedDiscount));
          }
          await tx.promoCode.update({
            where: { id: foundPromo.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      }

      // 10% platform commission, 90% driver earnings
      const commissionRate = 0.1;
      const commissionAmount = Math.round(finalPrice * commissionRate);
      const driverEarnings = finalPrice - commissionAmount;

      // 4. Generate random 4-digit verification code
      const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

      // 5. 10-minute payment timeout
      const paymentExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

      // 6. Create Booking record
      const booking = await tx.booking.create({
        data: {
          tripId,
          passengerId,
          seatCount,
          totalPrice: finalPrice,
          commissionAmount,
          driverEarnings,
          promoCodeId,
          status: BookingStatus.PENDING_PAYMENT,
          pickupAddress: pickupAddress || trip.originAddress,
          dropoffAddress: dropoffAddress || trip.destinationAddress,
          verificationCode,
          paymentExpiresAt,
          cancellationReason: passengerNotes ? `Izoh: ${passengerNotes}` : null,
        },
        include: {
          trip: {
            include: {
              driver: {
                include: {
                  user: {
                    select: {
                      id: true,
                      fullName: true,
                      phone: true,
                      avatarUrl: true,
                    },
                  },
                },
              },
              vehicle: true,
            },
          },
        },
      });

      this.logger.log(`Booking created: ${booking.id} for trip ${tripId}, user ${passengerId}`);
      return booking;
    });
  }

  async getPassengerBookings(passengerId: string) {
    // Run expiration check first to keep data fresh
    await this.expireUnpaidBookings();

    return this.prisma.booking.findMany({
      where: { passengerId },
      include: {
        trip: {
          include: {
            driver: {
              include: {
                user: {
                  select: {
                    fullName: true,
                    phone: true,
                    avatarUrl: true,
                  },
                },
              },
            },
            vehicle: true,
          },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBookingById(userId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        trip: {
          include: {
            driver: {
              include: {
                user: {
                  select: {
                    fullName: true,
                    phone: true,
                    avatarUrl: true,
                  },
                },
              },
            },
            vehicle: true,
            stops: { orderBy: { order: 'asc' } },
          },
        },
        passenger: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            avatarUrl: true,
          },
        },
        payments: true,
        rating: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Bron topilmadi');
    }

    // Must be passenger, driver of trip, or staff
    const isPassenger = booking.passengerId === userId;
    const isDriver = booking.trip.driver.userId === userId;

    if (!isPassenger && !isDriver) {
      throw new ForbiddenException('Ushbu bron ma`lumotlarini ko`rishga ruxsat yo`q');
    }

    return booking;
  }

  async cancelBooking(userId: string, bookingId: string, reason?: string) {
    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: {
          trip: {
            include: { driver: true },
          },
        },
      });

      if (!booking) {
        throw new NotFoundException('Bron topilmadi');
      }

      const isPassenger = booking.passengerId === userId;
      const isDriver = booking.trip.driver.userId === userId;

      if (!isPassenger && !isDriver) {
        throw new ForbiddenException('Bronni bekor qilish uchun ruxsat berilmagan');
      }

      if (
        booking.status === BookingStatus.CANCELLED_BY_PASSENGER ||
        booking.status === BookingStatus.CANCELLED_BY_DRIVER ||
        booking.status === BookingStatus.COMPLETED ||
        booking.status === BookingStatus.EXPIRED
      ) {
        throw new BadRequestException(`Ushbu bron allaqachon ${booking.status} holatida`);
      }

      // Return seats to trip
      await tx.trip.update({
        where: { id: booking.tripId },
        data: {
          availableSeats: { increment: booking.seatCount },
          status: TripStatus.PUBLISHED,
        },
      });

      const nextStatus = isPassenger
        ? BookingStatus.CANCELLED_BY_PASSENGER
        : BookingStatus.CANCELLED_BY_DRIVER;

      const updated = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: nextStatus,
          cancellationReason: reason || (isPassenger ? 'Yo`lovchi bekor qildi' : 'Haydovchi bekor qildi'),
        },
      });

      this.logger.log(`Booking ${bookingId} cancelled by ${userId} (${nextStatus})`);
      return updated;
    });
  }

  async getTripBookings(driverUserId: string, tripId: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      include: { driver: true },
    });

    if (!trip) {
      throw new NotFoundException('Reys topilmadi');
    }

    if (trip.driver.userId !== driverUserId) {
      throw new ForbiddenException('Ushbu reys yo`lovchilarini faqat reys haydovchisi ko`ra oladi');
    }

    return this.prisma.booking.findMany({
      where: { tripId },
      include: {
        passenger: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            avatarUrl: true,
          },
        },
        payments: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async verifyPassengerCode(driverUserId: string, bookingId: string, code: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        trip: {
          include: { driver: true },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Bron topilmadi');
    }

    if (booking.trip.driver.userId !== driverUserId) {
      throw new ForbiddenException('Faqat reys haydovchisi yo`lovchi kodini tekshirishi mumkin');
    }

    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException('Faqat to`langan va tasdiqlangan bron kodini tekshirish mumkin');
    }

    if (booking.verificationCode !== code.trim()) {
      throw new BadRequestException('Noto`g`ri tasdiqlash kodi kiritildi');
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.IN_PROGRESS },
    });

    this.logger.log(`Passenger boarded: booking ${bookingId} marked as IN_PROGRESS`);
    return {
      success: true,
      message: 'Yo`lovchi muvaffaqiyatli qabul qilindi',
      booking: updated,
    };
  }

  async expireUnpaidBookings(): Promise<number> {
    const now = new Date();
    const expiredBookings = await this.prisma.booking.findMany({
      where: {
        status: BookingStatus.PENDING_PAYMENT,
        paymentExpiresAt: { lt: now },
      },
    });

    if (expiredBookings.length === 0) {
      return 0;
    }

    for (const b of expiredBookings) {
      try {
        await this.prisma.$transaction(async (tx) => {
          await tx.booking.update({
            where: { id: b.id },
            data: { status: BookingStatus.EXPIRED },
          });

          await tx.trip.update({
            where: { id: b.tripId },
            data: {
              availableSeats: { increment: b.seatCount },
              status: TripStatus.PUBLISHED,
            },
          });
        });
        this.logger.log(`Booking ${b.id} expired due to payment timeout, seats returned to trip ${b.tripId}`);
      } catch (err) {
        this.logger.error(`Error expiring booking ${b.id}`, err);
      }
    }

    return expiredBookings.length;
  }
}
