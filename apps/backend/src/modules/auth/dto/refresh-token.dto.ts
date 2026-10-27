import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Yaroqli JWT refresh token',
  })
  @IsNotEmpty({ message: 'Refresh token kiritilishi shart' })
  @IsString()
  refreshToken!: string;
}
