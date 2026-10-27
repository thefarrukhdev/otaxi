import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { PayoutRequestDto } from './dto/payout-request.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { WalletTransactionType } from '@prisma/client';
import { IPaginatedResponse } from '@otaxi/types';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(private readonly prisma: PrismaService) {}

  private async getDriverProfile(userId: string) {
    const profile = await this.prisma.driverProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new ForbiddenException('Haydovchi hamyoni topilmadi. Avval haydovchi sifatida ro`yxatdan o`ting');
    }

    return profile;
  }

  async getWallet(userId: string) {
    const profile = await this.getDriverProfile(userId);

    const [earnedAggregate, payoutAggregate] = await Promise.all([
      this.prisma.walletTransaction.aggregate({
        where: {
          driverId: profile.id,
          type: WalletTransactionType.EARNING,
        },
        _sum: { amount: true },
      }),
      this.prisma.walletTransaction.aggregate({
        where: {
          driverId: profile.id,
          type: WalletTransactionType.PAYOUT,
        },
        _sum: { amount: true },
      }),
    ]);

    return {
      driverId: profile.id,
      balance: profile.walletBalance,
      currency: 'UZS',
      totalEarned: earnedAggregate._sum.amount || 0,
      totalWithdrawn: payoutAggregate._sum.amount || 0,
    };
  }

  async getTransactions(userId: string, pagination: PaginationDto): Promise<IPaginatedResponse<any>> {
    const profile = await this.getDriverProfile(userId);
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      this.prisma.walletTransaction.count({
        where: { driverId: profile.id },
      }),
      this.prisma.walletTransaction.findMany({
        where: { driverId: profile.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async requestPayout(userId: string, dto: PayoutRequestDto) {
    const profile = await this.getDriverProfile(userId);
    const amount = Number(dto.amount);
    const currentBalance = Number(profile.walletBalance);

    if (currentBalance < amount) {
      throw new BadRequestException(
        `Hamyonda yetarli mablag\` mavjud emas. Joriy balans: ${currentBalance} UZS`,
      );
    }

    const maskedCard = `${dto.cardNumber.slice(0, 4)} **** **** ${dto.cardNumber.slice(-4)}`;

    return this.prisma.$transaction(async (tx) => {
      // 1. Deduct driver balance
      const updatedProfile = await tx.driverProfile.update({
        where: { id: profile.id },
        data: {
          walletBalance: { decrement: amount },
        },
      });

      // 2. Record PAYOUT transaction
      const transaction = await tx.walletTransaction.create({
        data: {
          driverId: profile.id,
          type: WalletTransactionType.PAYOUT,
          amount,
          balanceBefore: currentBalance,
          balanceAfter: currentBalance - amount,
          description: `Kartaga pul yechish: ${maskedCard} (${dto.cardHolderName || 'Haydovchi'})`,
        },
      });

      this.logger.log(`Payout completed for driver ${profile.id}: -${amount} UZS to card ${maskedCard}`);

      return {
        success: true,
        message: 'Mablag` muvaffaqiyatli yechib olindi',
        transactionId: transaction.id,
        amount,
        remainingBalance: updatedProfile.walletBalance,
        cardNumber: maskedCard,
        createdAt: transaction.createdAt,
      };
    });
  }
}
