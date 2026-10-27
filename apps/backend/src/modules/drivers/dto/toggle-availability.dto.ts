import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ToggleAvailabilityDto {
  @ApiProperty({ example: true, description: 'Haydovchi faol/buyurtma qabul qilishga tayyormi' })
  @IsBoolean()
  isAvailable!: boolean;
}
