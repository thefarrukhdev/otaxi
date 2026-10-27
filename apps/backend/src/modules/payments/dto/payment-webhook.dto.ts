import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PaymentWebhookDto {
  @ApiPropertyOptional({ example: 'tx-provider-987654', description: 'Provayder tranzaksiya IDsi' })
  @IsOptional()
  @IsString()
  providerTxId?: string;

  @ApiPropertyOptional({ example: 'uuid-payment-id', description: 'OTAXI Payment IDsi' })
  @IsOptional()
  @IsString()
  paymentId?: string;

  @ApiPropertyOptional({ example: 'uuid-booking-id', description: 'Bron IDsi' })
  @IsOptional()
  @IsString()
  bookingId?: string;

  @ApiPropertyOptional({ example: 120000, description: 'To`lov summasi' })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiPropertyOptional({ example: 'COMPLETED', description: 'Provayder holati' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 'idem-key-12345', description: 'Idempotency kaliti' })
  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}
