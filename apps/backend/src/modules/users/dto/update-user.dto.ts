import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Alisher Navoiy', description: 'Foydalanuvchi to`liq ismi' })
  @IsOptional()
  @IsString()
  @Length(2, 100, { message: 'Ism 2 dan 100 ta belgiga bo`lishi kerak' })
  fullName?: string;

  @ApiPropertyOptional({ example: 'https://images.example.com/avatar.jpg', description: 'Avatar rasmi URL manzili' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: 'uz', enum: ['uz', 'ru', 'en', 'kz', 'kg'], description: 'Tanlangan til kodi' })
  @IsOptional()
  @IsString()
  @IsIn(['uz', 'ru', 'en', 'kz', 'kg'], { message: 'Qo`llab-quvvatlanadigan tillar: uz, ru, en, kz, kg' })
  preferredLanguage?: string;
}

export class UpdateLanguageDto {
  @ApiPropertyOptional({ example: 'uz', enum: ['uz', 'ru', 'en', 'kz', 'kg'], description: 'Tanlangan til kodi' })
  @IsString()
  @IsIn(['uz', 'ru', 'en', 'kz', 'kg'], { message: 'Qo`llab-quvvatlanadigan tillar: uz, ru, en, kz, kg' })
  language!: string;
}
