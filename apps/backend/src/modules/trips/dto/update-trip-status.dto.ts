import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TripStatus } from '@prisma/client';

export class UpdateTripStatusDto {
  @ApiProperty({ enum: TripStatus, example: TripStatus.IN_PROGRESS })
  @IsEnum(TripStatus, { message: 'Yaroqsiz reys statusi' })
  status!: TripStatus;
}
