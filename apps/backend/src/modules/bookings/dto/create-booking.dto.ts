import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { ICreateBookingDto } from '@otaxi/types';

export class CreateBookingDto implements ICreateBookingDto {
  @ApiProperty({ example: 'uuid-trip-id', description: 'Bron qilinayotgan reys IDsi' })
  @IsNotEmpty({ message: 'Reys IDsi kiritilishi shart' })
  @IsString()
  tripId!: string;

  @ApiProperty({ example: 1, default: 1, description: 'Bron qilinayotgan o`rindiqlar soni' })
  @IsInt()
  @Min(1, { message: 'Kamida 1 ta o`rindiq tanlanishi kerak' })
  @Max(8, { message: 'Maksimal 8 ta o`rindiq tanlash mumkin' })
  seatCount: number = 1;

  @ApiPropertyOptional({ example: 'Chilonzor 9-mavze, 12-uy', description: 'Yo`lovchini olib ketish manzili' })
  @IsOptional()
  @IsString()
  pickupAddress?: string;

  @ApiPropertyOptional({ example: 'Samarqand vokzal oldi', description: 'Yo`lovchini tushirish manzili' })
  @IsOptional()
  @IsString()
  dropoffAddress?: string;

  @ApiPropertyOptional({ example: 'OTAXI2026', description: 'Promokod' })
  @IsOptional()
  @IsString()
  promoCode?: string;

  @ApiPropertyOptional({ example: '1 ta kichik sumkam bor', description: 'Yo`lovchi izohi' })
  @IsOptional()
  @IsString()
  passengerNotes?: string;
}
