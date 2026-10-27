import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CancelBookingDto {
  @ApiPropertyOptional({ example: 'Rejalarim o`zgarib qoldi', description: 'Bekor qilish sababi' })
  @IsOptional()
  @IsString()
  reason?: string;
}
