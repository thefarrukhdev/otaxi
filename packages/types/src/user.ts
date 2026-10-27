import { UserRole, UserStatus } from './enums';

export interface IUser {
  id: string;
  phone: string;
  fullName: string;
  avatarUrl?: string | null;
  role: UserRole;
  status: UserStatus;
  preferredLanguage: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IAuthResponse {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

export interface IRequestOtpDto {
  phone: string;
}

export interface IVerifyOtpDto {
  phone: string;
  code: string;
}
