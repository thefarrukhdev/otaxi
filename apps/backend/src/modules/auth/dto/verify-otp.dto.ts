import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';
import { IVerifyOtpDto } from '@otaxi/types';

export class VerifyOtpDto implements IVerifyOtpDto {
  @ApiProperty({
    example: '+998901234567',
    description: 'Telefon raqami',
  })
  @IsNotEmpty({ message: 'Telefon raqami kiritilishi shart' })
  @IsString()
  @Matches(/^\+[1-9]\d{9,14}$/, {
    message: 'Telefon raqami xalqaro formatda bo`lishi shart',
  })
  phone!: string;

  @ApiProperty({
    example: '1234',
    description: 'SMS orqali yuborilgan 4 xonali tasdiqlash kodi',
  })
  @IsNotEmpty({ message: 'Tasdiqlash kodi kiritilishi shart' })
  @IsString()
  @Length(4, 6, { message: 'Kod 4 dan 6 xonagacha bo`lishi kerak' })
  code!: string;

  @ApiPropertyOptional({
    example: 'Aziz Rahimov',
    description: 'Yangi foydalanuvchi ismi (ixtiyoriy)',
  })
  @IsOptional()
  @IsString()
  fullName?: string;
}
