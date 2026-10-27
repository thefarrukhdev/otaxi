import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ example: 'Toyota', description: 'Markasi' })
  @IsNotEmpty({ message: 'Avtomobil markasi kiritilishi shart' })
  @IsString()
  make!: string;

  @ApiProperty({ example: 'Camry', description: 'Modeli' })
  @IsNotEmpty({ message: 'Avtomobil modeli kiritilishi shart' })
  @IsString()
  model!: string;

  @ApiProperty({ example: 'Oq (White)', description: 'Rangi' })
  @IsNotEmpty({ message: 'Avtomobil rangi kiritilishi shart' })
  @IsString()
  color!: string;

  @ApiProperty({ example: 2023, description: 'Ishlab chiqarilgan yili' })
  @IsInt()
  @Min(2000)
  @Max(2030)
  year!: number;

  @ApiProperty({ example: '01A777AA', description: 'Davlat raqam belgisi' })
  @IsNotEmpty({ message: 'Davlat raqam belgisi kiritilishi shart' })
  @IsString()
  licensePlate!: string;

  @ApiPropertyOptional({ example: 4, default: 4, description: 'Umumiy o`rindiqlar soni' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(8)
  totalSeats: number = 4;

  @ApiPropertyOptional({ example: true, default: true, description: 'Konditsioner mavjudligi' })
  @IsOptional()
  @IsBoolean()
  hasAirConditioner: boolean = true;

  @ApiPropertyOptional({ example: true, default: true, description: 'Bagaj joyi mavjudligi' })
  @IsOptional()
  @IsBoolean()
  hasLuggageSpace: boolean = true;

  @ApiPropertyOptional({ example: ['https://storage.otaxi.uz/cars/photo1.jpg'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos: string[] = [];
}
