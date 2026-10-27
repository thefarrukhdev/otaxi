import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DriversService } from './drivers.service';
import { SubmitVerificationDto } from './dto/submit-verification.dto';
import { ToggleAvailabilityDto } from './dto/toggle-availability.dto';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Drivers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Haydovchi profilini olish' })
  @ApiResponse({ status: 200, description: 'Haydovchi profili va statusi' })
  async getProfile(@CurrentUser() user: CurrentUserPayload) {
    return this.driversService.getDriverProfile(user.id);
  }

  @Post('verification')
  @ApiOperation({ summary: 'Verifikatsiya hujjatlarini va mashinani topshirish' })
  @ApiResponse({ status: 201, description: 'Hujjatlar ko`rib chiqish uchun qabul qilindi' })
  async submitVerification(@CurrentUser() user: CurrentUserPayload, @Body() dto: SubmitVerificationDto) {
    return this.driversService.submitVerification(user.id, dto);
  }

  @Patch('availability')
  @ApiOperation({ summary: 'Haydovchi faollik holatini o`zgartirish (on/off)' })
  @ApiResponse({ status: 200, description: 'Faollik holati yangilandi' })
  async toggleAvailability(@CurrentUser() user: CurrentUserPayload, @Body() dto: ToggleAvailabilityDto) {
    return this.driversService.toggleAvailability(user.id, dto.isAvailable);
  }

  @Get('earnings')
  @ApiOperation({ summary: 'Haydovchi daromadlari va balansini ko`rish' })
  @ApiResponse({ status: 200, description: 'Balans va tranzaksiyalar' })
  async getEarnings(@CurrentUser() user: CurrentUserPayload) {
    return this.driversService.getEarnings(user.id);
  }
}
