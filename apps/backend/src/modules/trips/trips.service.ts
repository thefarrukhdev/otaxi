import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { SearchTripsDto } from './dto/search-trips.dto';
import { CreateTripDto } from './dto/create-trip.dto';
import { BookingStatus, Prisma, TripStatus, VerificationStatus } from '@prisma/client';
import { IPaginatedResponse } from '@otaxi/types';

@Injectable()
export class TripsService {
  private readonly logger = new Logger(TripsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async searchTrips(dto: SearchTripsDto): Promise<IPaginatedResponse<any>> {
    const {
      originCity,
      destinationCity,
      originCountry,
      destinationCountry,
      departureDate,
      passengers = 1,
      minPrice,
      maxPrice,
      isInternational,
      onlyVerifiedDrivers = true,
      page = 1,
      limit = 20,
    } = dto;

    const where: Prisma.TripWhereInput = {
      status: TripStatus.PUBLISHED,
      availableSeats: { gte: Number(passengers) },
    };

    if (originCity) {
      where.originCity = { contains: originCity.trim(), mode: 'insensitive' };
    }

    if (destinationCity) {
      where.destinationCity = { contains: destinationCity.trim(), mode: 'insensitive' };
    }

    if (originCountry) {
      where.originCountry = originCountry;
    }

    if (destinationCountry) {
      where.destinationCountry = destinationCountry;
    }

    if (departureDate) {
      const startOfDay = new Date(departureDate);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(departureDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      where.departureTime = {
        gte: startOfDay,
        lte: endOfDay,
      };
    } else {
      // By default only show upcoming trips
      where.departureTime = { gte: new Date() };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.pricePerSeat = {};
      if (minPrice !== undefined) where.pricePerSeat.gte = minPrice;
      if (maxPrice !== undefined) where.pricePerSeat.lte = maxPrice;
    }

    if (isInternational !== undefined) {
      where.isInternational = isInternational;
    }

    if (onlyVerifiedDrivers) {
      where.driver = {
        verificationStatus: VerificationStatus.APPROVED,
      };
    }

    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      this.prisma.trip.count({ where }),
      this.prisma.trip.findMany({
        where,
        include: {
          driver: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  avatarUrl: true,
                  phone: true,
                },
              },
            },
          },
          vehicle: {
            select: {
              id: true,
              make: true,
              model: true,
              color: true,
              year: true,
              licensePlate: true,
              hasAirConditioner: true,
              hasLuggageSpace: true,
              photos: true,
            },
          },
          stops: {
            orderBy: { order: 'asc' },
          },
        },
        orderBy: [{ departureTime: 'asc' }, { pricePerSeat: 'asc' }],
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

  async getTripById(id: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id },
      include: {
        driver: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
                phone: true,
              },
            },
            documents: {
              where: { isVerified: true },
              select: { type: true, isVerified: true },
            },
          },
        },
        vehicle: true,
        stops: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            bookings: {
              where: {
                status: {
                  in: [BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS],
                },
              },
            },
          },
        },
      },
    });

    if (!trip) {
      throw new NotFoundException('Reys topilmadi');
    }

    return trip;
  }

  async createTrip(userId: string, dto: CreateTripDto) {
    const driverProfile = await this.prisma.driverProfile.findUnique({
      where: { userId },
    });

    if (!driverProfile) {
      throw new ForbiddenException('Haydovchi profili topilmadi');
    }

    if (driverProfile.verificationStatus !== VerificationStatus.APPROVED) {
      throw new ForbiddenException('Faqat hujjatlari tasdiqlangan haydovchilar reys yarata oladi');
    }

    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: dto.vehicleId },
    });

    if (!vehicle || vehicle.driverId !== driverProfile.id || !vehicle.isActive) {
      throw new BadRequestException('Tanlangan avtomobil ushbu haydovchiga biriktirilmagan yoki nofaol');
    }

    if (dto.totalSeats > vehicle.totalSeats) {
      throw new BadRequestException(
        `Belgilangan o\`rindiqlar soni avtomobil sig\`imidan (${vehicle.totalSeats}) oshmasligi kerak`,
      );
    }

    const departure = new Date(dto.departureTime);
    if (departure.getTime() <= Date.now()) {
      throw new BadRequestException('Jo`nash vaqti kelajakda bo`lishi shart');
    }

    const estimatedArrival = dto.estimatedArrivalTime
      ? new Date(dto.estimatedArrivalTime)
      : new Date(departure.getTime() + 4 * 60 * 60 * 1000); // default +4 hours

    const isInternational =
      dto.originCountry !== dto.destinationCountry || Boolean(dto.isInternational);

    return this.prisma.$transaction(async (tx) => {
      const trip = await tx.trip.create({
        data: {
          driverId: driverProfile.id,
          vehicleId: vehicle.id,
          originCity: dto.originCity,
          originCountry: dto.originCountry,
          originAddress: dto.originAddress,
          destinationCity: dto.destinationCity,
          destinationCountry: dto.destinationCountry,
          destinationAddress: dto.destinationAddress,
          departureTime: departure,
          estimatedArrivalTime: estimatedArrival,
          totalSeats: dto.totalSeats,
          availableSeats: dto.totalSeats,
          pricePerSeat: dto.pricePerSeat,
          currency: dto.currency,
          isInternational,
          allowLuggage: dto.allowLuggage,
          notes: dto.notes,
          status: TripStatus.PUBLISHED,
          stops: dto.stops && dto.stops.length > 0
            ? {
                create: dto.stops.map((stop) => ({
                  cityName: stop.cityName,
                  countryCode: stop.countryCode,
                  order: stop.order,
                  estimatedArrival: new Date(stop.estimatedArrival),
                  priceDelta: stop.priceDelta,
                })),
              }
            : undefined,
        },
        include: {
          vehicle: true,
          stops: true,
        },
      });

      this.logger.log(`Trip created: ${trip.id} by driver ${driverProfile.id}`);
      return trip;
    });
  }

  async getDriverTrips(userId: string) {
    const driverProfile = await this.prisma.driverProfile.findUnique({
      where: { userId },
    });

    if (!driverProfile) {
      throw new ForbiddenException('Haydovchi profili topilmadi');
    }

    return this.prisma.trip.findMany({
      where: { driverId: driverProfile.id },
      include: {
        vehicle: true,
        stops: {
          orderBy: { order: 'asc' },
        },
        bookings: {
          include: {
            passenger: {
              select: {
                id: true,
                fullName: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: { departureTime: 'desc' },
    });
  }

  async updateTripStatus(userId: string, tripId: string, newStatus: TripStatus) {
    const driverProfile = await this.prisma.driverProfile.findUnique({
      where: { userId },
    });

    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      include: { driver: true },
    });

    if (!trip) {
      throw new NotFoundException('Reys topilmadi');
    }

    if (!driverProfile || trip.driverId !== driverProfile.id) {
      throw new ForbiddenException('Ushbu reysni boshqarish huquqiga ega emassiz');
    }

    // Validate state machine transitions: DRAFT -> PUBLISHED -> IN_PROGRESS -> COMPLETED
    const current = trip.status;
    const allowedTransitions: Record<TripStatus, TripStatus[]> = {
      [TripStatus.DRAFT]: [TripStatus.PUBLISHED, TripStatus.CANCELLED],
      [TripStatus.PUBLISHED]: [TripStatus.IN_PROGRESS, TripStatus.CANCELLED, TripStatus.FULL],
      [TripStatus.FULL]: [TripStatus.IN_PROGRESS, TripStatus.CANCELLED, TripStatus.PUBLISHED],
      [TripStatus.IN_PROGRESS]: [TripStatus.COMPLETED, TripStatus.CANCELLED],
      [TripStatus.COMPLETED]: [],
      [TripStatus.CANCELLED]: [],
    };

    if (!allowedTransitions[current].includes(newStatus)) {
      throw new BadRequestException(
        `Reys statusini ${current} dan ${newStatus} ga o\`zgartirib bo\`lmaydi`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.trip.update({
        where: { id: tripId },
        data: { status: newStatus },
      });

      if (newStatus === TripStatus.COMPLETED) {
        // Mark all confirmed or in-progress bookings as COMPLETED
        await tx.booking.updateMany({
          where: {
            tripId,
            status: { in: [BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS] },
          },
          data: { status: BookingStatus.COMPLETED },
        });

        // Increment driver's totalTrips
        await tx.driverProfile.update({
          where: { id: driverProfile.id },
          data: { totalTrips: { increment: 1 } },
        });
      } else if (newStatus === TripStatus.CANCELLED) {
        // Cancel all bookings and return seats
        await tx.booking.updateMany({
          where: {
            tripId,
            status: { in: [BookingStatus.CONFIRMED, BookingStatus.PENDING_PAYMENT, BookingStatus.IN_PROGRESS] },
          },
          data: {
            status: BookingStatus.CANCELLED_BY_DRIVER,
            cancellationReason: 'Reys haydovchi tomonidan bekor qilindi',
          },
        });
      }

      this.logger.log(`Trip ${tripId} status transitioned from ${current} to ${newStatus}`);
      return updated;
    });
  }
}
