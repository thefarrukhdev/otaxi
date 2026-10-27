import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { CountryCode, ITripSearchFilters } from '@otaxi/types';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class SearchTripsDto extends PaginationDto implements ITripSearchFilters {
  @ApiPropertyOptional({ example: 'Toshkent', description: 'Jo`nash shahri' })
  @IsOptional()
  @IsString()
  originCity?: string;

  @ApiPropertyOptional({ example: 'Samarqand', description: 'Yetib borish shahri' })
  @IsOptional()
  @IsString()
  destinationCity?: string;

  @ApiPropertyOptional({ enum: CountryCode, example: CountryCode.UZ })
  @IsOptional()
  @IsEnum(CountryCode)
  originCountry?: CountryCode;

  @ApiPropertyOptional({ enum: CountryCode, example: CountryCode.UZ })
  @IsOptional()
  @IsEnum(CountryCode)
  destinationCountry?: CountryCode;

  @ApiPropertyOptional({ example: '2026-10-28', description: 'Jo`nash sanasi (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  departureDate?: string;

  @ApiPropertyOptional({ example: 1, default: 1, description: 'Kerakli o`rindiqlar soni' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  passengers?: number = 1;

  @ApiPropertyOptional({ example: 50000, description: 'Minimal narx' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ example: 300000, description: 'Maksimal narx' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ example: false, description: 'Xalqaro reyslar filteri' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isInternational?: boolean;

  @ApiPropertyOptional({ example: true, default: true, description: 'Faqat tasdiqlangan haydovchilar' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true || value === undefined)
  @IsBoolean()
  onlyVerifiedDrivers?: boolean = true;
}
