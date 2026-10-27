import { BookingStatus } from './enums';
import { ITrip } from './trip';
import { IUser } from './user';

export interface IBooking {
  id: string;
  tripId: string;
  trip?: ITrip;
  passengerId: string;
  passenger?: IUser;
  seatCount: number;
  totalPrice: number;
  commissionAmount: number;
  driverEarnings: number;
  promoCodeId?: string | null;
  status: BookingStatus;
  pickupAddress?: string | null;
  dropoffAddress?: string | null;
  cancellationReason?: string | null;
  verificationCode: string;
  paymentExpiresAt: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ICreateBookingDto {
  tripId: string;
  seatCount: number;
  pickupAddress?: string;
  dropoffAddress?: string;
  promoCode?: string;
  passengerNotes?: string;
}
