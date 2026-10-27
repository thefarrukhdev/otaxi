import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '@prisma/client';

@ApiTags('Vehicles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  @Roles(UserRole.DRIVER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Haydovchiga tegishli avtomobillar ro`yxati' })
  @ApiResponse({ status: 200, description: 'Avtomobillar ro`yxati' })
  async getVehicles(@CurrentUser() user: CurrentUserPayload) {
    return this.vehiclesService.getDriverVehicles(user.id);
  }

  @Post()
  @Roles(UserRole.DRIVER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Yangi avtomobil qo`shish' })
  @ApiResponse({ status: 201, description: 'Avtomobil muvaffaqiyatli yaratildi' })
  async createVehicle(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateVehicleDto) {
    return this.vehiclesService.createVehicle(user.id, dto);
  }

  @Patch(':id')
  @Roles(UserRole.DRIVER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Avtomobil ma`lumotlarini yangilash' })
  @ApiResponse({ status: 200, description: 'Avtomobil yangilandi' })
  async updateVehicle(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.updateVehicle(user.id, id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.DRIVER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Avtomobilni o`chirish' })
  @ApiResponse({ status: 200, description: 'Avtomobil o`chirildi' })
  async deleteVehicle(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.vehiclesService.deleteVehicle(user.id, id);
  }
}
