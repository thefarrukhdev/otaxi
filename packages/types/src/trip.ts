import { TripStatus, Currency, CountryCode } from './enums';
import { IDriverProfile, IVehicle } from './driver';

export interface ITripStop {
  id: string;
  tripId: string;
  cityName: string;
  countryCode: CountryCode;
  order: number;
  estimatedArrival: Date | string;
  priceDelta: number;
}

export interface ITrip {
  id: string;
  driverId: string;
  driver?: IDriverProfile;
  vehicleId: string;
  vehicle?: IVehicle;
  originCity: string;
  originCountry: CountryCode;
  originAddress: string;
  destinationCity: string;
  destinationCountry: CountryCode;
  destinationAddress: string;
  departureTime: Date | string;
  estimatedArrivalTime: Date | string;
  totalSeats: number;
  availableSeats: number;
  pricePerSeat: number;
  currency: Currency;
  isInternational: boolean;
  status: TripStatus;
  allowLuggage: boolean;
  notes?: string | null;
  stops?: ITripStop[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ITripSearchFilters {
  originCity?: string;
  destinationCity?: string;
  originCountry?: CountryCode;
  destinationCountry?: CountryCode;
  departureDate?: string;
  passengers?: number;
  minPrice?: number;
  maxPrice?: number;
  isInternational?: boolean;
  onlyVerifiedDrivers?: boolean;
}

export interface ICreateTripDto {
  vehicleId: string;
  originCity: string;
  originCountry: CountryCode;
  originAddress: string;
  destinationCity: string;
  destinationCountry: CountryCode;
  destinationAddress: string;
  departureTime: string;
  totalSeats: number;
  pricePerSeat: number;
  currency: Currency;
  isInternational: boolean;
  allowLuggage: boolean;
  notes?: string;
  stops?: {
    cityName: string;
    countryCode: CountryCode;
    order: number;
    estimatedArrival: string;
    priceDelta: number;
  }[];
}
