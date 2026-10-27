import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentSessionDto } from './dto/create-payment-session.dto';
import { PaymentWebhookDto } from './dto/payment-webhook.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PaymentProvider } from '@prisma/client';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('session')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'To`lov sessiyasini yaratish (Payme, Click, Uzum, Wallet)' })
  @ApiResponse({ status: 201, description: 'To`lov sessiyasi yaratildi' })
  async createPaymentSession(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreatePaymentSessionDto,
  ) {
    return this.paymentsService.createPaymentSession(user.id, dto);
  }

  @Public()
  @Post('webhook/:provider')
  @ApiOperation({ summary: 'To`lov tizimlari uchun idempotent webhook (Payme, Click, Uzum)' })
  @ApiResponse({ status: 200, description: 'Webhook muvaffaqiyatli qayta ishlandi' })
  async handleWebhook(
    @Param('provider') provider: PaymentProvider,
    @Body() payload: PaymentWebhookDto,
    @Headers('x-idempotency-key') idempotencyKeyHeader?: string,
  ) {
    return this.paymentsService.processWebhook(provider, payload, idempotencyKeyHeader);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'To`lov holatini tekshirish' })
  @ApiResponse({ status: 200, description: 'To`lov tafsilotlari' })
  async getPayment(@Param('id') id: string) {
    return this.paymentsService.getPaymentById(id);
  }

  @Public()
  @Get('checkout-mock')
  @ApiOperation({ summary: 'Lokal muhitda to`lovni sinovdan o`tkazish simulyatsiyasi' })
  async checkoutMock(
    @Query('paymentId') paymentId: string,
    @Query('provider') provider: PaymentProvider,
    @Query('amount') amount: number,
  ) {
    return {
      message: 'OTAXI Mock To`lov Sahifasi',
      paymentId,
      provider,
      amount,
      note: 'Haqiqiy to`lovni simulyatsiya qilish uchun POST /payments/webhook/:provider ga paymentId yuboring',
    };
  }
}
