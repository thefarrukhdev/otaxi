import { VerificationStatus, DocumentType } from './enums';
import { IUser } from './user';

export interface IDriverProfile {
  id: string;
  userId: string;
  user?: IUser;
  verificationStatus: VerificationStatus;
  rejectionReason?: string | null;
  verifiedAt?: Date | string | null;
  rating: number;
  totalTrips: number;
  totalReviews: number;
  isAvailable: boolean;
  documents?: IDriverDocument[];
  vehicles?: IVehicle[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IDriverDocument {
  id: string;
  driverId: string;
  type: DocumentType;
  fileUrl: string;
  expiresAt?: Date | string | null;
  isVerified: boolean;
  rejectedReason?: string | null;
  createdAt: Date | string;
}

export interface IVehicle {
  id: string;
  driverId: string;
  make: string;
  model: string;
  color: string;
  year: number;
  licensePlate: string;
  totalSeats: number;
  hasAirConditioner: boolean;
  hasLuggageSpace: boolean;
  photos: string[];
  isActive: boolean;
  createdAt: Date | string;
}

export interface ISubmitVerificationDto {
  driverLicenseNumber: string;
  documents: {
    type: DocumentType;
    fileUrl: string;
    expiresAt?: string;
  }[];
  vehicle: {
    make: string;
    model: string;
    color: string;
    year: number;
    licensePlate: string;
    totalSeats: number;
    hasAirConditioner: boolean;
    hasLuggageSpace: boolean;
    photos: string[];
  };
}
