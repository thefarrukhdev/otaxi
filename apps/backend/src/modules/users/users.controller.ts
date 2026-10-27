import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateLanguageDto, UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Joriy foydalanuvchi profilini olish' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi ma`lumotlari' })
  async getProfile(@CurrentUser() user: CurrentUserPayload) {
    return this.usersService.getProfile(user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Joriy foydalanuvchi profilini yangilash' })
  @ApiResponse({ status: 200, description: 'Yangilangan profil' })
  async updateProfile(@CurrentUser() user: CurrentUserPayload, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Patch('me/language')
  @ApiOperation({ summary: 'Foydalanuvchi interfeys tilini yangilash' })
  @ApiResponse({ status: 200, description: 'Til yangilandi' })
  async updateLanguage(@CurrentUser() user: CurrentUserPayload, @Body() dto: UpdateLanguageDto) {
    return this.usersService.updateLanguage(user.id, dto.language);
  }
}
