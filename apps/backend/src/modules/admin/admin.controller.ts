import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { ModerateDriverDto } from './dto/moderate-driver.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { BookingStatus, UserRole } from '@prisma/client';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.MODERATOR)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard/kpi')
  @ApiOperation({ summary: 'Admin Dashboard KPI ko`rsatkichlarini olish' })
  @ApiResponse({ status: 200, description: 'KPI statistikasi' })
  async getDashboardKpi() {
    return this.adminService.getDashboardKpi();
  }

  @Get('drivers/pending')
  @ApiOperation({ summary: 'Tasdiqlash kutilayotgan haydovchilar ro`yxati' })
  @ApiResponse({ status: 200, description: 'Haydovchilar ro`yxati' })
  async getPendingDrivers(@Query() pagination: PaginationDto) {
    return this.adminService.getPendingDrivers(pagination);
  }

  @Patch('drivers/:id/verification')
  @ApiOperation({ summary: 'Haydovchini tasdiqlash yoki rad etish' })
  @ApiResponse({ status: 200, description: 'Haydovchi statusi yangilandi' })
  async moderateDriver(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') driverProfileId: string,
    @Body() dto: ModerateDriverDto,
  ) {
    return this.adminService.moderateDriver(user.id, driverProfileId, dto);
  }

  @Get('bookings')
  @ApiOperation({ summary: 'Barcha buyurtmalar (bronlar) ro`yxati' })
  @ApiQuery({ name: 'status', enum: BookingStatus, required: false })
  @ApiResponse({ status: 200, description: 'Buyurtmalar ro`yxati' })
  async getAllBookings(
    @Query() pagination: PaginationDto,
    @Query('status') status?: BookingStatus,
  ) {
    return this.adminService.getAllBookings(pagination, status);
  }

  @Get('audit')
  @ApiOperation({ summary: 'Tizim audit jurnali' })
  @ApiResponse({ status: 200, description: 'Audit yozuvlari' })
  async getAuditLogs(@Query() pagination: PaginationDto) {
    return this.adminService.getAuditLogs(pagination);
  }
}
