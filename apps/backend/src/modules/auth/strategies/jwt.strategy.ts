import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../database/prisma.service';
import { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';
import { UserStatus } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  phone: string;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET') || 'otaxi_default_access_secret_2026',
    });
  }

  async validate(payload: JwtPayload): Promise<CurrentUserPayload> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        driverProfile: {
          select: { id: true },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Foydalanuvchi tizimda topilmadi');
    }

    if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
      throw new UnauthorizedException('Hisob bloklangan yoki o`chirilgan');
    }

    return {
      id: user.id,
      phone: user.phone,
      fullName: user.fullName,
      role: user.role,
      preferredLanguage: user.preferredLanguage,
      driverProfileId: user.driverProfile?.id,
    };
  }
}
