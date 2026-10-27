import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { VerifyBookingCodeDto } from './dto/verify-booking-code.dto';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '@prisma/client';

@ApiTags('Bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Reysda joy bron qilish (10 daqiqa to`lov kutish muddati)' })
  @ApiResponse({ status: 201, description: 'Bron muvaffaqiyatli yaratildi' })
  async createBooking(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(user.id, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Foydalanuvchining barcha bronlari ro`yxati' })
  @ApiResponse({ status: 200, description: 'Bronlar ro`yxati' })
  async getMyBookings(@CurrentUser() user: CurrentUserPayload) {
    return this.bookingsService.getPassengerBookings(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bron tafsilotlarini olish' })
  @ApiResponse({ status: 200, description: 'Bron ma`lumotlari' })
  async getBookingById(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.bookingsService.getBookingById(user.id, id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Bronni bekor qilish va joylarni qaytarish' })
  @ApiResponse({ status: 200, description: 'Bron bekor qilindi' })
  async cancelBooking(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: CancelBookingDto,
  ) {
    return this.bookingsService.cancelBooking(user.id, id, dto.reason);
  }

  @Get('trip/:tripId')
  @Roles(UserRole.DRIVER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Haydovchi o`z reysi yo`lovchilari ro`yxatini ko`rishi' })
  @ApiResponse({ status: 200, description: 'Reys yo`lovchilari' })
  async getTripBookings(@CurrentUser() user: CurrentUserPayload, @Param('tripId') tripId: string) {
    return this.bookingsService.getTripBookings(user.id, tripId);
  }

  @Post(':id/verify-code')
  @Roles(UserRole.DRIVER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Haydovchi yo`lovchi 4-xonali kodini tekshirishi (chiqish tasdig`i)' })
  @ApiResponse({ status: 200, description: 'Kod tekshirildi, yo`lovchi qabul qilindi' })
  async verifyBookingCode(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: VerifyBookingCodeDto,
  ) {
    return this.bookingsService.verifyPassengerCode(user.id, id, dto.code);
  }
}
