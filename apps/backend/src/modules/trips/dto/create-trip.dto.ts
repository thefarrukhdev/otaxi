import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CountryCode, Currency, ICreateTripDto } from '@otaxi/types';

export class TripStopDto {
  @ApiProperty({ example: 'Jizzax' })
  @IsNotEmpty()
  @IsString()
  cityName!: string;

  @ApiProperty({ enum: CountryCode, example: CountryCode.UZ })
  @IsEnum(CountryCode)
  countryCode!: CountryCode;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  order!: number;

  @ApiProperty({ example: '2026-10-28T10:00:00.000Z' })
  @IsDateString()
  estimatedArrival!: string;

  @ApiProperty({ example: 0, default: 0 })
  @IsNumber()
  priceDelta: number = 0;
}

export class CreateTripDto implements ICreateTripDto {
  @ApiProperty({ example: 'uuid-vehicle-id', description: 'Reysda qatnashadigan mashina IDsi' })
  @IsNotEmpty({ message: 'Avtomobil tanlanishi shart' })
  @IsString()
  vehicleId!: string;

  @ApiProperty({ example: 'Toshkent' })
  @IsNotEmpty()
  @IsString()
  originCity!: string;

  @ApiProperty({ enum: CountryCode, example: CountryCode.UZ })
  @IsEnum(CountryCode)
  originCountry!: CountryCode;

  @ApiProperty({ example: 'Olmazor metro bekati' })
  @IsNotEmpty()
  @IsString()
  originAddress!: string;

  @ApiProperty({ example: 'Samarqand' })
  @IsNotEmpty()
  @IsString()
  destinationCity!: string;

  @ApiProperty({ enum: CountryCode, example: CountryCode.UZ })
  @IsEnum(CountryCode)
  destinationCountry!: CountryCode;

  @ApiProperty({ example: 'Registon maydoni atrofi' })
  @IsNotEmpty()
  @IsString()
  destinationAddress!: string;

  @ApiProperty({ example: '2026-10-28T08:00:00.000Z', description: 'Jo`nash vaqti (ISO 8601)' })
  @IsDateString()
  departureTime!: string;

  @ApiPropertyOptional({ example: '2026-10-28T12:30:00.000Z', description: 'Yetib borish vaqti' })
  @IsOptional()
  @IsDateString()
  estimatedArrivalTime?: string;

  @ApiProperty({ example: 4, description: 'Umumiy o`rindiqlar soni' })
  @IsInt()
  @Min(1)
  totalSeats!: number;

  @ApiProperty({ example: 120000, description: 'Bir o`rindiq narxi' })
  @IsNumber()
  @Min(0)
  pricePerSeat!: number;

  @ApiPropertyOptional({ enum: Currency, default: Currency.UZS })
  @IsOptional()
  @IsEnum(Currency)
  currency: Currency = Currency.UZS;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isInternational: boolean = false;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  allowLuggage: boolean = true;

  @ApiPropertyOptional({ example: 'Konditsioner bor, chekilmaydi' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ type: [TripStopDto], description: 'Yo`l-yo`lakay to`xtash joylari' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TripStopDto)
  stops?: TripStopDto[];
}
