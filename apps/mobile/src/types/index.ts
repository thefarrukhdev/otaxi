import { CountryCode, Currency, TripStatus, BookingStatus, VerificationStatus, PaymentProvider } from '@otaxi/types';

export type UserMode = 'PASSENGER' | 'DRIVER';

export interface SeatInfo {
  seatNumber: number; // 1: Old o'rindiq, 2: Orqa chap, 3: Orqa o'rta, 4: Orqa o'ng
  label: string;
  isAvailable: boolean;
  priceDelta: number;
}

export interface DetailedTrip {
  id: string;
  originCity: string;
  originCountry: CountryCode;
  originAddress: string;
  destinationCity: string;
  destinationCountry: CountryCode;
  destinationAddress: string;
  departureTime: string;
  estimatedArrivalTime: string;
  durationMinutes: number;
  totalSeats: number;
  availableSeats: number;
  pricePerSeat: number;
  currency: Currency;
  isInternational: boolean;
  departureType?: 'SCHEDULED' | 'WHEN_FULL';
  status: TripStatus;
  allowLuggage: boolean;
  notes?: string;
  driver: {
    id: string;
    fullName: string;
    phone: string;
    photoUrl: string;
    rating: number;
    totalTrips: number;
    totalReviews: number;
    isVerified: boolean;
    verificationStatus: VerificationStatus;
    joinedYear: number;
    languages: string[];
  };
  vehicle: {
    id: string;
    make: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
    photoUrl: string;
    hasAirConditioner: boolean;
    hasLuggageSpace: boolean;
    trunkCapacity?: 'LARGE' | 'MEDIUM' | 'LIMITED';
    noSmoking: boolean;
    hasPhoneCharging: boolean;
  };
  stops: {
    id: string;
    cityName: string;
    countryCode: CountryCode;
    order: number;
    estimatedArrival: string;
    priceDelta: number;
  }[];
  seats: SeatInfo[];
}

export interface PassengerBooking {
  id: string;
  tripId: string;
  trip: DetailedTrip;
  passengerName: string;
  passengerPhone: string;
  passengerPassport?: string;
  selectedSeats: number[];
  seatCount: number;
  totalPrice: number;
  status: BookingStatus;
  paymentProvider: PaymentProvider;
  verificationCode: string; // 4-digit boarding code
  bookedAt: string;
  paymentExpiresAt: string;
}

export interface ManifestPassenger {
  id: string;
  seatNumber: number;
  name: string;
  phone: string;
  verificationCode: string; // 4-digit code e.g. "4892"
  isBoarded: boolean;
  paymentStatus: 'PAID' | 'CASH_ON_ARRIVAL';
  passportNumber?: string;
}

export interface ActiveDriverTrip {
  id: string;
  originCity: string;
  destinationCity: string;
  originAddress: string;
  destinationAddress: string;
  departureTime: string;
  departureType?: 'SCHEDULED' | 'WHEN_FULL';
  isInternational: boolean;
  status: 'SCHEDULED' | 'DEPARTED' | 'AT_BORDER' | 'COMPLETED';
  vehicle: {
    make: string;
    model: string;
    licensePlate: string;
  };
  totalSeats: number;
  pricePerSeat: number;
  currency: Currency;
  passengers: ManifestPassenger[];
  stops: string[];
}

export interface WalletTransaction {
  id: string;
  type: 'EARNING' | 'COMMISSION' | 'PAYOUT' | 'BONUS';
  amount: number;
  description: string;
  date: string;
  status: 'COMPLETED' | 'PENDING' | 'REJECTED';
}

export interface BorderChecklistItem {
  id: string;
  category: 'PASSPORT' | 'VISA' | 'CHILDREN' | 'CUSTOMS' | 'CURRENCY' | 'GENERAL';
  categoryTitle: string;
  title: string;
  description: string;
  isRequired: boolean;
}

export interface BorderChecklistGroup {
  fromCountry: CountryCode;
  toCountry: CountryCode;
  title: string;
  subtitle: string;
  version: string;
  lastVerified: string;
  officialSource: string;
  items: BorderChecklistItem[];
}
