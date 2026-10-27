import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyBookingCodeDto {
  @ApiProperty({ example: '4821', description: 'Yo`lovchi taqdim etgan 4 xonali chiqish kodi' })
  @IsNotEmpty({ message: 'Tasdiqlash kodi kiritilishi shart' })
  @IsString()
  @Length(4, 4, { message: 'Kod 4 xonali bo`lishi kerak' })
  code!: string;
}
