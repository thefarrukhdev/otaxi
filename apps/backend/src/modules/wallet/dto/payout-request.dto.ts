import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches, Min } from 'class-validator';

export class PayoutRequestDto {
  @ApiProperty({ example: 100000, description: 'Yechib olinayotgan summa (so`mda)' })
  @IsNumber()
  @Min(10000, { message: 'Minimal yechish summasi 10 000 so`m' })
  amount!: number;

  @ApiProperty({
    example: '8600123456789012',
    description: 'UzCard yoki Humo karta raqami (16 ta raqam)',
  })
  @IsNotEmpty({ message: 'Karta raqami kiritilishi shart' })
  @IsString()
  @Matches(/^\d{16}$/, { message: 'Karta raqami 16 ta raqamdan iborat bo`lishi kerak' })
  cardNumber!: string;

  @ApiPropertyOptional({ example: 'Aziz Rahimov', description: 'Karta egasining ismi' })
  @IsOptional()
  @IsString()
  cardHolderName?: string;
}
