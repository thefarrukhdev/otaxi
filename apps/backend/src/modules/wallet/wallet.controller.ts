import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { PayoutRequestDto } from './dto/payout-request.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '@prisma/client';

@ApiTags('Wallet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  @Roles(UserRole.DRIVER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Haydovchi hamyon balansi va umumiy ko`rsatkichlarini olish' })
  @ApiResponse({ status: 200, description: 'Hamyon holati' })
  async getWallet(@CurrentUser() user: CurrentUserPayload) {
    return this.walletService.getWallet(user.id);
  }

  @Get('transactions')
  @Roles(UserRole.DRIVER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Hamyon tranzaksiyalari jurnali (earning, commission, payout)' })
  @ApiResponse({ status: 200, description: 'Tranzaksiyalar ro`yxati' })
  async getTransactions(
    @CurrentUser() user: CurrentUserPayload,
    @Query() pagination: PaginationDto,
  ) {
    return this.walletService.getTransactions(user.id, pagination);
  }

  @Post('payouts')
  @Roles(UserRole.DRIVER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Kartaga pul yechish so`rovi (Payout)' })
  @ApiResponse({ status: 201, description: 'Pul yechish muvaffaqiyatli amalga oshirildi' })
  async requestPayout(@CurrentUser() user: CurrentUserPayload, @Body() dto: PayoutRequestDto) {
    return this.walletService.requestPayout(user.id, dto);
  }
}
