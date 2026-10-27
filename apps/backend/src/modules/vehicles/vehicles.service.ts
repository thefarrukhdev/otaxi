import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  private async getDriverProfileId(userId: string): Promise<string> {
    const profile = await this.prisma.driverProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new ForbiddenException('Haydovchi profili topilmadi. Avval haydovchi sifatida ro`yxatdan o`ting.');
    }

    return profile.id;
  }

  async getDriverVehicles(userId: string) {
    const driverId = await this.getDriverProfileId(userId);

    return this.prisma.vehicle.findMany({
      where: { driverId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createVehicle(userId: string, dto: CreateVehicleDto) {
    const driverId = await this.getDriverProfileId(userId);

    const existing = await this.prisma.vehicle.findUnique({
      where: { licensePlate: dto.licensePlate },
    });

    if (existing) {
      if (existing.driverId === driverId && !existing.isActive) {
        // Reactivate vehicle
        return this.prisma.vehicle.update({
          where: { id: existing.id },
          data: { ...dto, isActive: true },
        });
      }
      throw new BadRequestException('Ushbu davlat raqam belgisi allaqachon ro`yxatdan o`tgan');
    }

    return this.prisma.vehicle.create({
      data: {
        driverId,
        make: dto.make,
        model: dto.model,
        color: dto.color,
        year: dto.year,
        licensePlate: dto.licensePlate,
        totalSeats: dto.totalSeats ?? 4,
        hasAirConditioner: dto.hasAirConditioner ?? true,
        hasLuggageSpace: dto.hasLuggageSpace ?? true,
        photos: dto.photos ?? [],
        isActive: true,
      },
    });
  }

  async updateVehicle(userId: string, vehicleId: string, dto: UpdateVehicleDto) {
    const driverId = await this.getDriverProfileId(userId);

    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle || vehicle.driverId !== driverId) {
      throw new NotFoundException('Avtomobil topilmadi');
    }

    if (dto.licensePlate && dto.licensePlate !== vehicle.licensePlate) {
      const conflict = await this.prisma.vehicle.findUnique({
        where: { licensePlate: dto.licensePlate },
      });
      if (conflict) {
        throw new BadRequestException('Ushbu davlat raqam belgisi allaqachon mavjud');
      }
    }

    return this.prisma.vehicle.update({
      where: { id: vehicleId },
      data: dto,
    });
  }

  async deleteVehicle(userId: string, vehicleId: string) {
    const driverId = await this.getDriverProfileId(userId);

    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle || vehicle.driverId !== driverId) {
      throw new NotFoundException('Avtomobil topilmadi');
    }

    // Soft delete
    await this.prisma.vehicle.update({
      where: { id: vehicleId },
      data: { isActive: false },
    });

    return { success: true, message: 'Avtomobil muvaffaqiyatli o`chirildi' };
  }
}
