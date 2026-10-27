import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserMode, DetailedTrip, PassengerBooking, ActiveDriverTrip, WalletTransaction } from '../types';
import { MOCK_TRIPS, INITIAL_BOOKINGS, INITIAL_ACTIVE_DRIVER_TRIP, INITIAL_TRANSACTIONS } from '../lib/data';
import { BookingStatus, PaymentProvider, VerificationStatus } from '@otaxi/types';

interface DriverVerificationState {
  status: VerificationStatus;
  licenseFrontUploaded: boolean;
  licenseBackUploaded: boolean;
  techPassportUploaded: boolean;
  insuranceUploaded: boolean;
  carPhotosUploaded: boolean;
  submittedAt?: string;
  notes?: string;
}

interface AppContextType {
  // Mode switch
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  toggleUserMode: () => void;

  // Trips & Bookings (Passenger)
  trips: DetailedTrip[];
  bookings: PassengerBooking[];
  activeBooking: PassengerBooking | null;
  bookTrip: (params: {
    tripId: string;
    seatNumbers: number[];
    passengerName: string;
    passengerPhone: string;
    passengerPassport?: string;
    paymentProvider: PaymentProvider;
  }) => PassengerBooking;
  cancelBooking: (bookingId: string) => void;

  // Driver Active Trip
  activeDriverTrip: ActiveDriverTrip;
  verifyPassengerCode: (code: string) => { success: boolean; message: string; passengerName?: string };
  updateTripStatus: (status: ActiveDriverTrip['status']) => void;
  createDriverTrip: (newTrip: Partial<DetailedTrip>) => void;

  // Driver Wallet
  driverBalance: number;
  transactions: WalletTransaction[];
  requestPayout: (cardNumber: string, amount: number) => { success: boolean; message: string };

  // Driver Verification
  verification: DriverVerificationState;
  uploadDocument: (docType: 'licenseFront' | 'licenseBack' | 'techPassport' | 'insurance' | 'carPhotos') => void;
  submitVerification: () => void;

  // Border Checklist
  checkedItems: Record<string, boolean>;
  toggleChecklistItem: (itemId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Mode: Passenger by default
  const [userMode, setUserMode] = useState<UserMode>('PASSENGER');

  // Trips state
  const [trips, setTrips] = useState<DetailedTrip[]>(MOCK_TRIPS);
  const [bookings, setBookings] = useState<PassengerBooking[]>(INITIAL_BOOKINGS);

  // Driver state
  const [activeDriverTrip, setActiveDriverTrip] = useState<ActiveDriverTrip>(INITIAL_ACTIVE_DRIVER_TRIP);
  const [driverBalance, setDriverBalance] = useState<number>(1450000);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(INITIAL_TRANSACTIONS);

  // Driver verification
  const [verification, setVerification] = useState<DriverVerificationState>({
    status: VerificationStatus.APPROVED,
    licenseFrontUploaded: true,
    licenseBackUploaded: true,
    techPassportUploaded: true,
    insuranceUploaded: true,
    carPhotosUploaded: true,
    submittedAt: '2025-11-10',
    notes: 'Barcha hujjatlar muvaffaqiyatli tekshirildi va tasdiqlandi.',
  });

  // Checklist state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'kz-pass-1': true,
    'kz-visa-1': true,
  });

  const toggleUserMode = () => {
    setUserMode((prev) => (prev === 'PASSENGER' ? 'DRIVER' : 'PASSENGER'));
  };

  const activeBooking = bookings.find((b) => b.status === BookingStatus.CONFIRMED) || null;

  const bookTrip = ({
    tripId,
    seatNumbers,
    passengerName,
    passengerPhone,
    passengerPassport,
    paymentProvider,
  }: {
    tripId: string;
    seatNumbers: number[];
    passengerName: string;
    passengerPhone: string;
    passengerPassport?: string;
    paymentProvider: PaymentProvider;
  }): PassengerBooking => {
    const targetTrip = trips.find((t) => t.id === tripId) || trips[0];
    const generatedCode = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit code e.g. 5821
    const totalPrice = targetTrip.pricePerSeat * seatNumbers.length;

    const newBooking: PassengerBooking = {
      id: `bk-${Date.now().toString().slice(-5)}`,
      tripId: targetTrip.id,
      trip: targetTrip,
      passengerName,
      passengerPhone,
      passengerPassport,
      selectedSeats: seatNumbers,
      seatCount: seatNumbers.length,
      totalPrice,
      status: BookingStatus.CONFIRMED,
      paymentProvider,
      verificationCode: generatedCode,
      bookedAt: new Date().toISOString(),
      paymentExpiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    };

    // Update trip available seats
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === tripId) {
          const updatedSeats = t.seats.map((s) =>
            seatNumbers.includes(s.seatNumber) ? { ...s, isAvailable: false } : s
          );
          return {
            ...t,
            availableSeats: Math.max(0, t.availableSeats - seatNumbers.length),
            seats: updatedSeats,
          };
        }
        return t;
      })
    );

    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const cancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: BookingStatus.CANCELLED_BY_PASSENGER } : b))
    );
  };

  // Driver verification code validation
  const verifyPassengerCode = (
    code: string
  ): { success: boolean; message: string; passengerName?: string } => {
    const trimmed = code.trim();
    const match = activeDriverTrip.passengers.find((p) => p.verificationCode === trimmed);

    if (!match) {
      return {
        success: false,
        message: 'Kiritilgan 4 xonali kod noto’g’ri. Qaytadan tekshirib ko’ring.',
      };
    }

    if (match.isBoarded) {
      return {
        success: false,
        message: `${match.name} allaqachon bortga qabul qilingan.`,
        passengerName: match.name,
      };
    }

    setActiveDriverTrip((prev) => ({
      ...prev,
      passengers: prev.passengers.map((p) => (p.id === match.id ? { ...p, isBoarded: true } : p)),
    }));

    return {
      success: true,
      message: `${match.name} (Joy #${match.seatNumber}) muvaffaqiyatli bortga qabul qilindi!`,
      passengerName: match.name,
    };
  };

  const updateTripStatus = (status: ActiveDriverTrip['status']) => {
    setActiveDriverTrip((prev) => ({ ...prev, status }));

    // If completed, add earnings to driver balance
    if (status === 'COMPLETED') {
      const tripEarnings = 360000;
      const commission = 36000;
      const net = tripEarnings - commission;

      setDriverBalance((prev) => prev + net);
      setTransactions((prev) => [
        {
          id: `tx-${Date.now()}-earn`,
          type: 'EARNING',
          amount: tripEarnings,
          description: `${activeDriverTrip.originCity} — ${activeDriverTrip.destinationCity} safar tushumi`,
          date: 'Hozirgina',
          status: 'COMPLETED',
        },
        {
          id: `tx-${Date.now()}-comm`,
          type: 'COMMISSION',
          amount: -commission,
          description: 'OTAXI xizmat komissiyasi (10%)',
          date: 'Hozirgina',
          status: 'COMPLETED',
        },
        ...prev,
      ]);
    }
  };

  const createDriverTrip = (newTripData: Partial<DetailedTrip>) => {
    const newTrip: DetailedTrip = {
      id: `trip-user-${Date.now().toString().slice(-4)}`,
      originCity: newTripData.originCity || 'Toshkent',
      originCountry: newTripData.originCountry || ('UZ' as any),
      originAddress: newTripData.originAddress || 'Markaziy avtoshoxbekat',
      destinationCity: newTripData.destinationCity || 'Samarqand',
      destinationCountry: newTripData.destinationCountry || ('UZ' as any),
      destinationAddress: newTripData.destinationAddress || 'Markaz',
      departureTime: newTripData.departureTime || new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      estimatedArrivalTime: new Date(Date.now() + 28 * 3600 * 1000).toISOString(),
      durationMinutes: 210,
      totalSeats: newTripData.totalSeats || 4,
      availableSeats: newTripData.totalSeats || 4,
      pricePerSeat: newTripData.pricePerSeat || 90000,
      currency: newTripData.currency || ('UZS' as any),
      isInternational: !!newTripData.isInternational,
      status: 'PUBLISHED' as any,
      allowLuggage: true,
      notes: newTripData.notes || 'Yangi e’lon qilingan reys',
      driver: {
        id: 'drv-current',
        fullName: 'Siz (Haydovchi)',
        phone: '+998 90 999 88 11',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        rating: 4.95,
        totalTrips: 185,
        totalReviews: 48,
        isVerified: true,
        verificationStatus: VerificationStatus.APPROVED,
        joinedYear: 2024,
        languages: ["O'zbekcha", 'Русский'],
      },
      vehicle: {
        id: 'veh-curr',
        make: 'Chevrolet',
        model: 'Malibu 2',
        year: 2023,
        color: 'Qora metallik',
        licensePlate: '01 A 777 AA',
        photoUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
        hasAirConditioner: true,
        hasLuggageSpace: true,
        noSmoking: true,
        hasPhoneCharging: true,
      },
      stops: [],
      seats: [
        { seatNumber: 1, label: 'Old o’rindiq', isAvailable: true, priceDelta: 10000 },
        { seatNumber: 2, label: 'Orqa chap o’rindiq', isAvailable: true, priceDelta: 0 },
        { seatNumber: 3, label: 'Orqa o’rta o’rindiq', isAvailable: true, priceDelta: 0 },
        { seatNumber: 4, label: 'Orqa o’ng o’rindiq', isAvailable: true, priceDelta: 0 },
      ],
    };

    setTrips((prev) => [newTrip, ...prev]);
  };

  const requestPayout = (cardNumber: string, amount: number): { success: boolean; message: string } => {
    if (amount < 50000) {
      return { success: false, message: 'Minimal yechib olish summasi 50,000 UZS.' };
    }
    if (amount > driverBalance) {
      return { success: false, message: 'Hamyonda yetarli mablag’ mavjud emas.' };
    }

    setDriverBalance((prev) => prev - amount);
    const maskedCard = `${cardNumber.slice(0, 4)} **** **** ${cardNumber.slice(-4)}`;

    const newTx: WalletTransaction = {
      id: `tx-payout-${Date.now()}`,
      type: 'PAYOUT',
      amount: -amount,
      description: `${maskedCard} kartasiga pul yechish`,
      date: 'Hozirgina',
      status: 'COMPLETED',
    };

    setTransactions((prev) => [newTx, ...prev]);
    return {
      success: true,
      message: `${amount.toLocaleString('uz-UZ')} UZS muvaffaqiyatli o'tkazildi (Komissiya: 0%).`,
    };
  };

  const uploadDocument = (docType: 'licenseFront' | 'licenseBack' | 'techPassport' | 'insurance' | 'carPhotos') => {
    setVerification((prev) => ({
      ...prev,
      [`${docType}Uploaded`]: true,
    }));
  };

  const submitVerification = () => {
    setVerification((prev) => ({
      ...prev,
      status: VerificationStatus.PENDING_REVIEW,
      submittedAt: new Date().toISOString().split('T')[0],
      notes: 'Hujjatlaringiz xavfsizlik xizmati tomonidan tekshirilmoqda. Odatda 15 daqiqa vaqt oladi.',
    }));
  };

  const toggleChecklistItem = (itemId: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  return (
    <AppContext.Provider
      value={{
        userMode,
        setUserMode,
        toggleUserMode,
        trips,
        bookings,
        activeBooking,
        bookTrip,
        cancelBooking,
        activeDriverTrip,
        verifyPassengerCode,
        updateTripStatus,
        createDriverTrip,
        driverBalance,
        transactions,
        requestPayout,
        verification,
        uploadDocument,
        submitVerification,
        checkedItems,
        toggleChecklistItem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
