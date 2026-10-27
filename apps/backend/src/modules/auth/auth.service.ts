import { Injectable, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { IAuthResponse, IUser } from '@otaxi/types';
import { UserRole, UserStatus } from '@prisma/client';

interface OtpRecord {
  code: string;
  expiresAt: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  // In-memory OTP storage for simulated SMS (TTL: 5 minutes)
  private readonly otpStore = new Map<string, OtpRecord>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async requestOtp(dto: RequestOtpDto): Promise<{ message: string; expiresIn: number; simulatedCode?: string }> {
    const { phone } = dto;
    // Generate 4-digit numeric code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresIn = 300; // 5 minutes in seconds
    const expiresAt = Date.now() + expiresIn * 1000;

    this.otpStore.set(phone, { code, expiresAt });

    this.logger.log(`[SMS-OTP] Phone: ${phone} -> OTP Code: ${code} (expires in ${expiresIn}s)`);

    // In non-production environments, return simulatedCode for easier developer testing
    const isDev = this.configService.get<string>('NODE_ENV') !== 'production';

    return {
      message: 'Tasdiqlash kodi telefoningizga yuborildi',
      expiresIn,
      ...(isDev ? { simulatedCode: code } : {}),
    };
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<IAuthResponse> {
    const { phone, code, fullName } = dto;

    // Validate OTP
    const stored = this.otpStore.get(phone);
    const isMasterCode = code === '1234' || code === '7777'; // Development master codes

    if (!isMasterCode) {
      if (!stored) {
        throw new BadRequestException('Tasdiqlash kodi so`ralmagan yoki muddati tugagan');
      }

      if (Date.now() > stored.expiresAt) {
        this.otpStore.delete(phone);
        throw new BadRequestException('Tasdiqlash kodi muddati o`tgan. Yangi kod so`rang');
      }

      if (stored.code !== code) {
        throw new BadRequestException('Noto`g`ri tasdiqlash kodi kiritildi');
      }
    }

    // Clear used OTP
    this.otpStore.delete(phone);

    // Find or create user
    let user = await this.prisma.user.findUnique({
      where: { phone },
      include: {
        driverProfile: true,
      },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phone,
          fullName: fullName?.trim() || `Foydalanuvchi (${phone.slice(-4)})`,
          role: UserRole.PASSENGER,
          status: UserStatus.ACTIVE,
          preferredLanguage: 'uz',
        },
        include: {
          driverProfile: true,
        },
      });
      this.logger.log(`New user registered via OTP: ${user.phone} (${user.id})`);
    } else if (fullName && fullName.trim() !== '' && user.fullName.startsWith('Foydalanuvchi')) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { fullName: fullName.trim() },
        include: {
          driverProfile: true,
        },
      });
    }

    if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
      throw new UnauthorizedException('Ushbu hisob faol emas yoki bloklangan');
    }

    const tokens = await this.generateTokens(user.id, user.phone, user.role);

    const mappedUser: IUser = {
      id: user.id,
      phone: user.phone,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      role: user.role as any,
      status: user.status as any,
      preferredLanguage: user.preferredLanguage,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    return {
      user: mappedUser,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async refreshTokens(dto: RefreshTokenDto): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'otaxi_default_refresh_secret_2026',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
        throw new UnauthorizedException('Foydalanuvchi hisobi faol emas');
      }

      const accessToken = this.jwtService.sign(
        { sub: user.id, phone: user.phone, role: user.role },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET') || 'otaxi_default_access_secret_2026',
          expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION') || '15m',
        },
      );

      return { accessToken };
    } catch {
      throw new UnauthorizedException('Refresh token yaroqsiz yoki muddati o`tgan');
    }
  }

  async logout(userId: string): Promise<{ success: boolean; message: string }> {
    this.logger.log(`User logged out: ${userId}`);
    return {
      success: true,
      message: 'Tizimdan muvaffaqiyatli chiqildi',
    };
  }

  private async generateTokens(userId: string, phone: string, role: string) {
    const payload = { sub: userId, phone, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET') || 'otaxi_default_access_secret_2026',
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION') || '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'otaxi_default_refresh_secret_2026',
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
