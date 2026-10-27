import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ModerateDriverDto } from './dto/moderate-driver.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { BookingStatus, VerificationStatus } from '@prisma/client';
import { IPaginatedResponse } from '@otaxi/types';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getDashboardKpi() {
    const [
      totalTrips,
      totalBookings,
      completedBookings,
      revenueAgg,
      totalUsers,
      totalDrivers,
      activeApprovedDrivers,
      pendingVerifications,
    ] = await Promise.all([
      this.prisma.trip.count(),
      this.prisma.booking.count(),
      this.prisma.booking.count({ where: { status: BookingStatus.COMPLETED } }),
      this.prisma.booking.aggregate({
        where: {
          status: { in: [BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS, BookingStatus.COMPLETED] },
        },
        _sum: {
          totalPrice: true,
          commissionAmount: true,
          driverEarnings: true,
        },
      }),
      this.prisma.user.count(),
      this.prisma.driverProfile.count(),
      this.prisma.driverProfile.count({
        where: {
          verificationStatus: VerificationStatus.APPROVED,
          isAvailable: true,
        },
      }),
      this.prisma.driverProfile.count({
        where: { verificationStatus: VerificationStatus.PENDING_REVIEW },
      }),
    ]);

    return {
      totalTrips,
      totalBookings,
      completedBookings,
      totalRevenue: revenueAgg._sum.totalPrice || 0,
      totalCommission: revenueAgg._sum.commissionAmount || 0,
      totalDriverEarnings: revenueAgg._sum.driverEarnings || 0,
      totalUsers,
      totalDrivers,
      activeApprovedDrivers,
      pendingVerifications,
      currency: 'UZS',
    };
  }

  async getPendingDrivers(pagination: PaginationDto): Promise<IPaginatedResponse<any>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      this.prisma.driverProfile.count({
        where: { verificationStatus: VerificationStatus.PENDING_REVIEW },
      }),
      this.prisma.driverProfile.findMany({
        where: { verificationStatus: VerificationStatus.PENDING_REVIEW },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              phone: true,
              avatarUrl: true,
              createdAt: true,
            },
          },
          documents: true,
          vehicles: true,
        },
        orderBy: { updatedAt: 'asc' },
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

  async moderateDriver(adminUserId: string, driverProfileId: string, dto: ModerateDriverDto) {
    const driver = await this.prisma.driverProfile.findUnique({
      where: { id: driverProfileId },
      include: { user: true },
    });

    if (!driver) {
      throw new NotFoundException('Haydovchi profili topilmadi');
    }

    if (dto.status === VerificationStatus.REJECTED && !dto.rejectionReason) {
      throw new BadRequestException('Haydovchini rad etishda rad etish sababi ko`rsatilishi shart');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Update driver profile status
      const updated = await tx.driverProfile.update({
        where: { id: driverProfileId },
        data: {
          verificationStatus: dto.status,
          verifiedAt: dto.status === VerificationStatus.APPROVED ? new Date() : null,
          verifiedBy: dto.status === VerificationStatus.APPROVED ? adminUserId : null,
          rejectionReason: dto.status === VerificationStatus.REJECTED ? dto.rejectionReason : null,
          isAvailable: dto.status === VerificationStatus.APPROVED,
        },
      });

      // 2. If approved, mark documents as verified
      if (dto.status === VerificationStatus.APPROVED) {
        await tx.driverDocument.updateMany({
          where: { driverId: driverProfileId },
          data: { isVerified: true },
        });
      }

      // 3. Find or create staff entry for admin to attach audit log
      let staff = await tx.staff.findUnique({
        where: { userId: adminUserId },
      });

      if (!staff) {
        staff = await tx.staff.create({
          data: {
            userId: adminUserId,
            department: 'ADMINISTRATION',
            permissions: ['ALL'],
          },
        });
      }

      // 4. Record Audit Log
      await tx.auditLog.create({
        data: {
          staffId: staff.id,
          action: `DRIVER_VERIFICATION_${dto.status}`,
          entity: 'DriverProfile',
          entityId: driverProfileId,
          diff: {
            previousStatus: driver.verificationStatus,
            newStatus: dto.status,
            rejectionReason: dto.rejectionReason || null,
            driverPhone: driver.user.phone,
          },
        },
      });

      this.logger.log(`Driver ${driverProfileId} moderated by admin ${adminUserId}: ${dto.status}`);
      return updated;
    });
  }

  async getAllBookings(pagination: PaginationDto, status?: BookingStatus): Promise<IPaginatedResponse<any>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [total, items] = await Promise.all([
      this.prisma.booking.count({ where }),
      this.prisma.booking.findMany({
        where,
        include: {
          passenger: {
            select: {
              id: true,
              fullName: true,
              phone: true,
            },
          },
          trip: {
            include: {
              driver: {
                include: {
                  user: {
                    select: {
                      id: true,
                      fullName: true,
                      phone: true,
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

  async getAuditLogs(pagination: PaginationDto): Promise<IPaginatedResponse<any>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      this.prisma.auditLog.count(),
      this.prisma.auditLog.findMany({
        include: {
          staff: {
            include: {
              user: {
                select: {
                  fullName: true,
                  phone: true,
                  role: true,
                },
              },
            },
          },
        },
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
}
