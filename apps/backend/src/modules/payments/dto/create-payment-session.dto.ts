import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { PaymentProvider, ICreatePaymentSessionDto } from '@otaxi/types';

export class CreatePaymentSessionDto implements ICreatePaymentSessionDto {
  @ApiProperty({ example: 'uuid-booking-id', description: 'To`lov qilinayotgan bron IDsi' })
  @IsNotEmpty({ message: 'Bron IDsi kiritilishi shart' })
  @IsString()
  bookingId!: string;

  @ApiProperty({ enum: PaymentProvider, example: PaymentProvider.PAYME, description: 'To`lov provayderi' })
  @IsEnum(PaymentProvider, { message: 'Qo`llab-quvvatlanadigan provayderlar: PAYME, CLICK, UZUM, CASH, WALLET' })
  provider!: PaymentProvider;

  @ApiProperty({
    example: 'pay-uuid-idem-key-12345',
    description: 'Takroriy to`lov oldini oluvchi unikal Idempotency kaliti',
  })
  @IsNotEmpty({ message: 'Idempotency kaliti kiritilishi shart' })
  @IsString()
  idempotencyKey!: string;
}
