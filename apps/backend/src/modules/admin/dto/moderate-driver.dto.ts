import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { VerificationStatus } from '@prisma/client';

export class ModerateDriverDto {
  @ApiProperty({
    enum: [VerificationStatus.APPROVED, VerificationStatus.REJECTED],
    example: VerificationStatus.APPROVED,
    description: 'Qaror: APPROVED (Tasdiqlash) yoki REJECTED (Rad etish)',
  })
  @IsEnum(VerificationStatus, { message: 'Status APPROVED yoki REJECTED bo`lishi kerak' })
  status!: VerificationStatus;

  @ApiPropertyOptional({
    example: 'Haydovchilik guvohnomasining amal qilish muddati o`tgan',
    description: 'Rad etish sababi (REJECTED holatida majburiy)',
  })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
