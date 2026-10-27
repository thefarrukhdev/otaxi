import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString, Matches } from 'class-validator';
import { IRequestOtpDto } from '@otaxi/types';

export class RequestOtpDto implements IRequestOtpDto {
  @ApiProperty({
    example: '+998901234567',
    description: 'Foydalanuvchi telefon raqami (E.164 formatida)',
  })
  @IsNotEmpty({ message: 'Telefon raqami kiritilishi shart' })
  @IsString()
  @Matches(/^\+[1-9]\d{9,14}$/, {
    message: 'Telefon raqami xalqaro formatda bo`lishi shart (masalan: +998901234567)',
  })
  phone!: string;
}
