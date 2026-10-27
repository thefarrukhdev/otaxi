import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { SubmitVerificationDto } from './dto/submit-verification.dto';
import { UserRole, VerificationStatus, WalletTransactionType } from '@prisma/client';

@Injectable()
export class DriversService {
  private readonly logger = new Logger(DriversService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getDriverProfile(userId: string) {
    const profile = await this.prisma.driverProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            fullName: true,
            avatarUrl: true,
            role: true,
            status: true,
          },
        },
        vehicles: {
          where: { isActive: true },
        },
        documents: true,
      },
    });

    if (!profile) {
      // If user hasn't started driver verification yet
      return {
        userId,
        verificationStatus: VerificationStatus.UNVERIFIED,
        rating: 5.0,
        totalTrips: 0,
        totalReviews: 0,
        isAvailable: false,
        walletBalance: 0,
        documents: [],
        vehicles: [],
      };
    }

    return profile;
  }

  async submitVerification(userId: string, dto: SubmitVerificationDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Ensure driver profile exists
      let profile = await tx.driverProfile.findUnique({
        where: { userId },
      });

      if (!profile) {
        profile = await tx.driverProfile.create({
          data: {
            userId,
            verificationStatus: VerificationStatus.PENDING_REVIEW,
            isAvailable: false,
          },
        });
      } else {
        profile = await tx.driverProfile.update({
          where: { id: profile.id },
          data: {
            verificationStatus: VerificationStatus.PENDING_REVIEW,
            rejectionReason: null,
          },
        });
      }

      // 2. Save documents
      if (dto.documents && dto.documents.length > 0) {
        for (const doc of dto.documents) {
          await tx.driverDocument.create({
            data: {
              driverId: profile.id,
              type: doc.type,
              fileUrl: doc.fileUrl,
              expiresAt: doc.expiresAt ? new Date(doc.expiresAt) : null,
              isVerified: false,
            },
          });
        }
      }

      // 3. Create or update vehicle
      const existingVehicle = await tx.vehicle.findUnique({
        where: { licensePlate: dto.vehicle.licensePlate },
      });

      if (existingVehicle && existingVehicle.driverId !== profile.id) {
        throw new BadRequestException('Ushbu davlat raqamli avtomobil boshqa haydovchiga biriktirilgan');
      }

      if (existingVehicle) {
        await tx.vehicle.update({
          where: { id: existingVehicle.id },
          data: {
            make: dto.vehicle.make,
            model: dto.vehicle.model,
            color: dto.vehicle.color,
            year: dto.vehicle.year,
            totalSeats: dto.vehicle.totalSeats,
            hasAirConditioner: dto.vehicle.hasAirConditioner,
            hasLuggageSpace: dto.vehicle.hasLuggageSpace,
            photos: dto.vehicle.photos,
            isActive: true,
          },
        });
      } else {
        await tx.vehicle.create({
          data: {
            driverId: profile.id,
            make: dto.vehicle.make,
            model: dto.vehicle.model,
            color: dto.vehicle.color,
            year: dto.vehicle.year,
            licensePlate: dto.vehicle.licensePlate,
            totalSeats: dto.vehicle.totalSeats,
            hasAirConditioner: dto.vehicle.hasAirConditioner,
            hasLuggageSpace: dto.vehicle.hasLuggageSpace,
            photos: dto.vehicle.photos,
            isActive: true,
          },
        });
      }

      // 4. Update user role to DRIVER
      await tx.user.update({
        where: { id: userId },
        data: { role: UserRole.DRIVER },
      });

      this.logger.log(`Driver verification submitted for user ${userId}, profile ${profile.id}`);

      return tx.driverProfile.findUnique({
        where: { id: profile.id },
        include: {
          vehicles: true,
          documents: true,
        },
      });
    });
  }

  async toggleAvailability(userId: string, isAvailable: boolean) {
    const profile = await this.prisma.driverProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Haydovchi profili topilmadi');
    }

    if (profile.verificationStatus !== VerificationStatus.APPROVED && isAvailable) {
      throw new BadRequestException('Faqat tasdiqlangan haydovchilar faol holatga o`tishi mumkin');
    }

    return this.prisma.driverProfile.update({
      where: { id: profile.id },
      data: { isAvailable },
    });
  }

  async getEarnings(userId: string) {
    const profile = await this.prisma.driverProfile.findUnique({
      where: { userId },
      include: {
        walletTransactions: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Haydovchi profili topilmadi');
    }

    // Calculate total earned from wallet transactions of type EARNING
    const earningsSum = await this.prisma.walletTransaction.aggregate({
      where: {
        driverId: profile.id,
        type: WalletTransactionType.EARNING,
      },
      _sum: {
        amount: true,
      },
    });

    const commissionSum = await this.prisma.walletTransaction.aggregate({
      where: {
        driverId: profile.id,
        type: WalletTransactionType.COMMISSION,
      },
      _sum: {
        amount: true,
      },
    });

    return {
      walletBalance: profile.walletBalance,
      totalEarned: earningsSum._sum.amount || 0,
      totalCommission: commissionSum._sum.amount || 0,
      totalTrips: profile.totalTrips,
      rating: profile.rating,
      recentTransactions: profile.walletTransactions,
    };
  }
}
