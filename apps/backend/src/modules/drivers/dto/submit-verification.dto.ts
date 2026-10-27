import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { DocumentType, ISubmitVerificationDto } from '@otaxi/types';

export class DriverDocumentItemDto {
  @ApiProperty({ enum: DocumentType, example: DocumentType.DRIVER_LICENSE_FRONT })
  @IsEnum(DocumentType)
  type!: DocumentType;

  @ApiProperty({ example: 'https://storage.otaxi.uz/docs/license-front.jpg' })
  @IsNotEmpty()
  @IsString()
  fileUrl!: string;

  @ApiPropertyOptional({ example: '2028-12-31' })
  @IsOptional()
  @IsString()
  expiresAt?: string;
}

export class VerificationVehicleDto {
  @ApiProperty({ example: 'Chevrolet' })
  @IsNotEmpty()
  @IsString()
  make!: string;

  @ApiProperty({ example: 'Cobalt' })
  @IsNotEmpty()
  @IsString()
  model!: string;

  @ApiProperty({ example: 'Oq' })
  @IsNotEmpty()
  @IsString()
  color!: string;

  @ApiProperty({ example: 2023 })
  @IsInt()
  @Min(2000)
  @Max(2030)
  year!: number;

  @ApiProperty({ example: '01A777AA' })
  @IsNotEmpty()
  @IsString()
  licensePlate!: string;

  @ApiProperty({ example: 4, default: 4 })
  @IsInt()
  @Min(1)
  @Max(8)
  totalSeats: number = 4;

  @ApiProperty({ example: true, default: true })
  @IsBoolean()
  hasAirConditioner: boolean = true;

  @ApiProperty({ example: true, default: true })
  @IsBoolean()
  hasLuggageSpace: boolean = true;

  @ApiProperty({ example: ['https://storage.otaxi.uz/cars/cobalt1.jpg'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  photos: string[] = [];
}

export class SubmitVerificationDto implements ISubmitVerificationDto {
  @ApiProperty({ example: 'AA1234567', description: 'Haydovchilik guvohnomasi seriya va raqami' })
  @IsNotEmpty()
  @IsString()
  driverLicenseNumber!: string;

  @ApiProperty({ type: [DriverDocumentItemDto], description: 'Yuklangan hujjatlar ro`yxati' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DriverDocumentItemDto)
  documents!: DriverDocumentItemDto[];

  @ApiProperty({ type: VerificationVehicleDto, description: 'Asosiy avtomobil ma`lumotlari' })
  @ValidateNested()
  @Type(() => VerificationVehicleDto)
  vehicle!: VerificationVehicleDto;
}
