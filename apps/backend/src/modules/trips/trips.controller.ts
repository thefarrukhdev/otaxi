import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TripsService } from './trips.service';
import { SearchTripsDto } from './dto/search-trips.dto';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripStatusDto } from './dto/update-trip-status.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '@prisma/client';

@ApiTags('Trips')
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Public()
  @Get('search')
  @ApiOperation({ summary: 'Mavjud reyslarni qidirish va filtrlash' })
  @ApiResponse({ status: 200, description: 'Qidiruv natijalari' })
  async searchTrips(@Query() query: SearchTripsDto) {
    return this.tripsService.searchTrips(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Reys tafsilotlarini olish' })
  @ApiResponse({ status: 200, description: 'Reys ma`lumotlari' })
  async getTripById(@Param('id') id: string) {
    return this.tripsService.getTripById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yangi reys yaratish (faqat tasdiqlangan haydovchilar)' })
  @ApiResponse({ status: 201, description: 'Reys muvaffaqiyatli yaratildi' })
  async createTrip(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateTripDto) {
    return this.tripsService.createTrip(user.id, dto);
  }

  @Get('driver/my-trips')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Haydovchining barcha yaratgan reyslari ro`yxati' })
  @ApiResponse({ status: 200, description: 'Haydovchi reyslari' })
  async getDriverTrips(@CurrentUser() user: CurrentUserPayload) {
    return this.tripsService.getDriverTrips(user.id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reys statusini yangilash (DRAFT -> PUBLISHED -> IN_PROGRESS -> COMPLETED)' })
  @ApiResponse({ status: 200, description: 'Reys statusi yangilandi' })
  async updateTripStatus(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateTripStatusDto,
  ) {
    return this.tripsService.updateTripStatus(user.id, id, dto.status);
  }
}
