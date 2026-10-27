import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CountryCode } from '@prisma/client';

export class GetBorderChecklistDto {
  @ApiPropertyOptional({ enum: CountryCode, example: CountryCode.UZ, description: 'Chiqish mamlakati' })
  @IsOptional()
  @IsEnum(CountryCode)
  from?: CountryCode;

  @ApiPropertyOptional({ enum: CountryCode, example: CountryCode.KZ, description: 'Kirish mamlakati' })
  @IsOptional()
  @IsEnum(CountryCode)
  to?: CountryCode;
}
