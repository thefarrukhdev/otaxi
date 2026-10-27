import {
  VerificationStatus,
  DocumentType,
  TripStatus,
  BookingStatus,
  PaymentProvider,
  PaymentStatus,
  CountryCode,
  Currency,
} from '@otaxi/types';

export interface AdminKpiData {
  totalBookings: number;
  bookingsGrowthPercent: number;
  monthlyGmvUzs: number;
  gmvGrowthPercent: number;
  commissionRevenueUzs: number;
  commissionGrowthPercent: number;
  activeDriversCount: number;
  pendingVerificationsCount: number;
  activeTripsCount: number;
  cancellationRate: number;
  recentTrends: {
    date: string;
    gmv: number;
    bookings: number;
    commission: number;
  }[];
}

export const mockKpiData: AdminKpiData = {
  totalBookings: 14820,
  bookingsGrowthPercent: 18.4,
  monthlyGmvUzs: 1850400000, // 1.85 mlrd UZS
  gmvGrowthPercent: 24.2,
  commissionRevenueUzs: 222048000, // 12% commission
  commissionGrowthPercent: 21.7,
  activeDriversCount: 1450,
  pendingVerificationsCount: 19,
  activeTripsCount: 184,
  cancellationRate: 3.2,
  recentTrends: [
    { date: '21-Okt', gmv: 42000000, bookings: 380, commission: 5040000 },
    { date: '22-Okt', gmv: 49500000, bookings: 440, commission: 5940000 },
    { date: '23-Okt', gmv: 56000000, bookings: 510, commission: 6720000 },
    { date: '24-Okt', gmv: 68000000, bookings: 620, commission: 8160000 },
    { date: '25-Okt', gmv: 81000000, bookings: 750, commission: 9720000 },
    { date: '26-Okt', gmv: 89000000, bookings: 820, commission: 10680000 },
    { date: '27-Okt', gmv: 94500000, bookings: 890, commission: 11340000 },
  ],
};

export interface VerificationDriver {
  id: string;
  fullName: string;
  phone: string;
  avatarUrl: string;
  rating: number;
  status: VerificationStatus;
  submissionDate: string;
  carMake: string;
  carModel: string;
  carColor: string;
  carYear: number;
  licensePlate: string;
  seats: number;
  documents: {
    id: string;
    type: DocumentType;
    title: string;
    fileUrl: string;
    expiresAt?: string;
    isVerified: boolean;
  }[];
  vehiclePhotos: string[];
}

export const mockVerificationDrivers: VerificationDriver[] = [
  {
    id: 'drv-001',
    fullName: 'Jaloliddin Qodirov',
    phone: '+998 90 123 45 67',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    rating: 4.95,
    status: VerificationStatus.PENDING_REVIEW,
    submissionDate: '2026-10-27T10:15:00Z',
    carMake: 'Chevrolet',
    carModel: 'Cobalt LTZ',
    carColor: 'Oq (Gaz White)',
    carYear: 2023,
    licensePlate: '01 A 777 BA',
    seats: 4,
    documents: [
      {
        id: 'doc-101',
        type: DocumentType.DRIVER_LICENSE_FRONT,
        title: 'Haydovchilik guvohnomasi (Old tomoni)',
        fileUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
        expiresAt: '2033-05-12',
        isVerified: false,
      },
      {
        id: 'doc-102',
        type: DocumentType.DRIVER_LICENSE_BACK,
        title: 'Haydovchilik guvohnomasi (Orqa tomoni)',
        fileUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
        expiresAt: '2033-05-12',
        isVerified: false,
      },
      {
        id: 'doc-103',
        type: DocumentType.TECH_PASSPORT_FRONT,
        title: 'Avtomobil texpasporti (Old)',
        fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
        expiresAt: '2028-11-20',
        isVerified: false,
      },
      {
        id: 'doc-104',
        type: DocumentType.INTERNATIONAL_PERMIT,
        title: 'Xalqaro reys ruxsatnomasi (Tir/Litsenziya)',
        fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
        expiresAt: '2027-01-01',
        isVerified: false,
      },
    ],
    vehiclePhotos: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: 'drv-002',
    fullName: 'Azamat Berdiqulov',
    phone: '+998 94 987 65 43',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    rating: 4.88,
    status: VerificationStatus.PENDING_REVIEW,
    submissionDate: '2026-10-27T11:40:00Z',
    carMake: 'Toyota',
    carModel: 'Camry 70',
    carColor: 'Qora (Pearl Black)',
    carYear: 2021,
    licensePlate: '10 X 888 XA',
    seats: 4,
    documents: [
      {
        id: 'doc-201',
        type: DocumentType.DRIVER_LICENSE_FRONT,
        title: 'Haydovchilik guvohnomasi (Old tomoni)',
        fileUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
        expiresAt: '2031-09-18',
        isVerified: false,
      },
      {
        id: 'doc-202',
        type: DocumentType.TECH_PASSPORT_FRONT,
        title: 'Avtomobil texpasporti',
        fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
        isVerified: false,
      },
    ],
    vehiclePhotos: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: 'drv-003',
    fullName: 'Shavkat Mamatqulov',
    phone: '+998 91 333 22 11',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 4.98,
    status: VerificationStatus.APPROVED,
    submissionDate: '2026-10-26T08:30:00Z',
    carMake: 'Hyundai',
    carModel: 'Sonata',
    carColor: 'Kulrang Metalik',
    carYear: 2022,
    licensePlate: '01 020 OOO',
    seats: 4,
    documents: [
      {
        id: 'doc-301',
        type: DocumentType.DRIVER_LICENSE_FRONT,
        title: 'Haydovchilik guvohnomasi',
        fileUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
        expiresAt: '2032-02-14',
        isVerified: true,
      },
    ],
    vehiclePhotos: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: 'drv-004',
    fullName: 'Olimjon Ergashev',
    phone: '+998 97 456 11 22',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    rating: 4.7,
    status: VerificationStatus.REJECTED,
    submissionDate: '2026-10-25T14:10:00Z',
    carMake: 'Daewoo',
    carModel: 'Nexia 2',
    carColor: 'Oq',
    carYear: 2012,
    licensePlate: '30 A 123 AA',
    seats: 4,
    documents: [
      {
        id: 'doc-401',
        type: DocumentType.DRIVER_LICENSE_FRONT,
        title: 'Haydovchilik guvohnomasi',
        fileUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
        expiresAt: '2025-01-01',
        isVerified: false,
      },
    ],
    vehiclePhotos: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80',
    ],
  },
];

export interface AdminTripRow {
  id: string;
  driverName: string;
  driverPhone: string;
  driverRating: number;
  vehicleInfo: string;
  originCity: string;
  originCountry: CountryCode;
  destinationCity: string;
  destinationCountry: CountryCode;
  departureTime: string;
  estimatedArrival: string;
  totalSeats: number;
  availableSeats: number;
  pricePerSeat: number;
  currency: Currency;
  isInternational: boolean;
  status: TripStatus;
  bookingsCount: number;
}

export const mockTrips: AdminTripRow[] = [
  {
    id: 'trp-901',
    driverName: 'Jaloliddin Qodirov',
    driverPhone: '+998 90 123 45 67',
    driverRating: 4.95,
    vehicleInfo: 'Chevrolet Cobalt (01 A 777 BA)',
    originCity: 'Toshkent',
    originCountry: CountryCode.UZ,
    destinationCity: 'Olmaota (Almaty)',
    destinationCountry: CountryCode.KZ,
    departureTime: '2026-10-28T07:00:00Z',
    estimatedArrival: '2026-10-28T19:00:00Z',
    totalSeats: 4,
    availableSeats: 1,
    pricePerSeat: 350000,
    currency: Currency.UZS,
    isInternational: true,
    status: TripStatus.PUBLISHED,
    bookingsCount: 3,
  },
  {
    id: 'trp-902',
    driverName: 'Azamat Berdiqulov',
    driverPhone: '+998 94 987 65 43',
    driverRating: 4.88,
    vehicleInfo: 'Toyota Camry (10 X 888 XA)',
    originCity: 'Toshkent',
    originCountry: CountryCode.UZ,
    destinationCity: 'Samarqand',
    destinationCountry: CountryCode.UZ,
    departureTime: '2026-10-28T09:30:00Z',
    estimatedArrival: '2026-10-28T13:30:00Z',
    totalSeats: 4,
    availableSeats: 0,
    pricePerSeat: 110000,
    currency: Currency.UZS,
    isInternational: false,
    status: TripStatus.FULL,
    bookingsCount: 4,
  },
  {
    id: 'trp-903',
    driverName: 'Shavkat Mamatqulov',
    driverPhone: '+998 91 333 22 11',
    driverRating: 4.98,
    vehicleInfo: 'Hyundai Sonata (01 020 OOO)',
    originCity: 'Fargʻona',
    originCountry: CountryCode.UZ,
    destinationCity: 'Bishkek',
    destinationCountry: CountryCode.KG,
    departureTime: '2026-10-28T06:00:00Z',
    estimatedArrival: '2026-10-28T17:30:00Z',
    totalSeats: 4,
    availableSeats: 2,
    pricePerSeat: 290000,
    currency: Currency.UZS,
    isInternational: true,
    status: TripStatus.PUBLISHED,
    bookingsCount: 2,
  },
  {
    id: 'trp-904',
    driverName: 'Dilshod Rahmatov',
    driverPhone: '+998 93 555 44 33',
    driverRating: 4.92,
    vehicleInfo: 'Chevrolet Lacetti (40 B 999 BA)',
    originCity: 'Toshkent',
    originCountry: CountryCode.UZ,
    destinationCity: 'Buxoro',
    destinationCountry: CountryCode.UZ,
    departureTime: '2026-10-27T14:00:00Z',
    estimatedArrival: '2026-10-27T21:00:00Z',
    totalSeats: 4,
    availableSeats: 0,
    pricePerSeat: 140000,
    currency: Currency.UZS,
    isInternational: false,
    status: TripStatus.IN_PROGRESS,
    bookingsCount: 4,
  },
  {
    id: 'trp-905',
    driverName: 'Sardor Sobirov',
    driverPhone: '+998 99 777 88 99',
    driverRating: 4.85,
    vehicleInfo: 'Kia K5 (01 Z 555 ZZ)',
    originCity: 'Toshkent',
    originCountry: CountryCode.UZ,
    destinationCity: 'Chimkent (Shymkent)',
    destinationCountry: CountryCode.KZ,
    departureTime: '2026-10-26T08:00:00Z',
    estimatedArrival: '2026-10-26T12:00:00Z',
    totalSeats: 4,
    availableSeats: 0,
    pricePerSeat: 180000,
    currency: Currency.UZS,
    isInternational: true,
    status: TripStatus.COMPLETED,
    bookingsCount: 4,
  },
];

export interface AdminBookingRow {
  id: string;
  bookingCode: string;
  passengerName: string;
  passengerPhone: string;
  tripId: string;
  route: string;
  isInternational: boolean;
  departureTime: string;
  seatCount: number;
  totalPrice: number;
  commissionAmount: number;
  driverEarnings: number;
  currency: Currency;
  status: BookingStatus;
  paymentProvider: PaymentProvider;
  paymentStatus: PaymentStatus;
  verificationCode: string;
  createdAt: string;
}

export const mockBookings: AdminBookingRow[] = [
  {
    id: 'bk-8901',
    bookingCode: 'OTX-8901',
    passengerName: 'Bobur Mirzayev',
    passengerPhone: '+998 90 999 11 22',
    tripId: 'trp-901',
    route: 'Toshkent ➔ Olmaota (Almaty)',
    isInternational: true,
    departureTime: '2026-10-28T07:00:00Z',
    seatCount: 2,
    totalPrice: 700000,
    commissionAmount: 84000,
    driverEarnings: 616000,
    currency: Currency.UZS,
    status: BookingStatus.CONFIRMED,
    paymentProvider: PaymentProvider.PAYME,
    paymentStatus: PaymentStatus.COMPLETED,
    verificationCode: '4921',
    createdAt: '2026-10-27T09:12:00Z',
  },
  {
    id: 'bk-8902',
    bookingCode: 'OTX-8902',
    passengerName: 'Madina Umarova',
    passengerPhone: '+998 93 111 22 33',
    tripId: 'trp-901',
    route: 'Toshkent ➔ Olmaota (Almaty)',
    isInternational: true,
    departureTime: '2026-10-28T07:00:00Z',
    seatCount: 1,
    totalPrice: 350000,
    commissionAmount: 42000,
    driverEarnings: 308000,
    currency: Currency.UZS,
    status: BookingStatus.CONFIRMED,
    paymentProvider: PaymentProvider.CLICK,
    paymentStatus: PaymentStatus.COMPLETED,
    verificationCode: '7103',
    createdAt: '2026-10-27T10:05:00Z',
  },
  {
    id: 'bk-8903',
    bookingCode: 'OTX-8903',
    passengerName: 'Farhod Yunusov',
    passengerPhone: '+998 97 888 77 66',
    tripId: 'trp-902',
    route: 'Toshkent ➔ Samarqand',
    isInternational: false,
    departureTime: '2026-10-28T09:30:00Z',
    seatCount: 2,
    totalPrice: 220000,
    commissionAmount: 26400,
    driverEarnings: 193600,
    currency: Currency.UZS,
    status: BookingStatus.CONFIRMED,
    paymentProvider: PaymentProvider.UZUM,
    paymentStatus: PaymentStatus.COMPLETED,
    verificationCode: '3382',
    createdAt: '2026-10-27T12:20:00Z',
  },
  {
    id: 'bk-8904',
    bookingCode: 'OTX-8904',
    passengerName: 'Nigora Karimova',
    passengerPhone: '+998 94 444 55 66',
    tripId: 'trp-903',
    route: 'Fargʻona ➔ Bishkek',
    isInternational: true,
    departureTime: '2026-10-28T06:00:00Z',
    seatCount: 1,
    totalPrice: 290000,
    commissionAmount: 34800,
    driverEarnings: 255200,
    currency: Currency.UZS,
    status: BookingStatus.PENDING_PAYMENT,
    paymentProvider: PaymentProvider.PAYME,
    paymentStatus: PaymentStatus.PENDING,
    verificationCode: '8814',
    createdAt: '2026-10-27T18:10:00Z',
  },
  {
    id: 'bk-8905',
    bookingCode: 'OTX-8905',
    passengerName: 'Temur Alimov',
    passengerPhone: '+998 90 234 56 78',
    tripId: 'trp-904',
    route: 'Toshkent ➔ Buxoro',
    isInternational: false,
    departureTime: '2026-10-27T14:00:00Z',
    seatCount: 1,
    totalPrice: 140000,
    commissionAmount: 16800,
    driverEarnings: 123200,
    currency: Currency.UZS,
    status: BookingStatus.CANCELLED_BY_PASSENGER,
    paymentProvider: PaymentProvider.CLICK,
    paymentStatus: PaymentStatus.REFUNDED,
    verificationCode: '1099',
    createdAt: '2026-10-26T15:30:00Z',
  },
];

export interface AdminBorderChecklist {
  id: string;
  fromCountry: CountryCode;
  toCountry: CountryCode;
  borderPoint: string;
  title: string;
  description: string;
  version: string;
  lastVerifiedAt: string;
  items: {
    id: string;
    titleUz: string;
    titleRu: string;
    category: 'PASSPORT' | 'VISA' | 'VEHICLE' | 'CHILDREN' | 'CUSTOMS' | 'CURRENCY';
    isRequired: boolean;
    description: string;
  }[];
}

export const mockChecklists: AdminBorderChecklist[] = [
  {
    id: 'chk-uz-kz',
    fromCountry: CountryCode.UZ,
    toCountry: CountryCode.KZ,
    borderPoint: "G'ishtko'prik (Zhibek Zholy) / Yallama",
    title: "O'zbekiston ➔ Qozog'iston Chegara O'tish Talablari",
    description: "Toshkentdan Chimkent, Taraz va Olmaota tomon harakatlanayotgan avtotransport va yo'lovchilar uchun rasmiy me'yoriy chek-list",
    version: '1.4',
    lastVerifiedAt: '2026-10-25T12:00:00Z',
    items: [
      {
        id: 'uz-kz-1',
        titleUz: 'Xorijga chiqish biometrik pasporti (Qizil pasport)',
        titleRu: 'Заграничный биометрический паспорт',
        category: 'PASSPORT',
        isRequired: true,
        description: "Yaroqlilik muddati safar tugashidan kamida 6 oy oshiq bo'lishi talab etiladi.",
      },
      {
        id: 'uz-kz-2',
        titleUz: 'Visasiz rejim shartlari (30 kungacha)',
        titleRu: 'Условия безвизового режима (до 30 дней)',
        category: 'VISA',
        isRequired: true,
        description: "O'zbekiston fuqarolari Qozog'istonda 30 kungacha ro'yxatdan o'tmasdan bo'lishi mumkin. 180 kunlik oraliqda jami 90 kun.",
      },
      {
        id: 'uz-kz-3',
        titleUz: "Avtotransport texpasporti va Sug'urtasi (Qozog'iston OGO)",
        titleRu: 'Техпаспорт и страховка ОГПО РК',
        category: 'VEHICLE',
        isRequired: true,
        description: "Mashina haydovchining o'z nomida bo'lmasa, chet elga chiqish huquqi bilan notarial ishonchnoma va chegara zonasida Qozog'iston sug'urtasi.",
      },
      {
        id: 'uz-kz-4',
        titleUz: 'Voyaga yetmagan bolalar uchun notarial ruxsatnoma',
        titleRu: 'Нотариальное согласие на выезд несовершеннолетних',
        category: 'CHILDREN',
        isRequired: false,
        description: "Bola ota-onasining faqat biri bilan bo'lsa yoki uchinchi shaxs bilan ketayotgan bo'lsa majburiy.",
      },
      {
        id: 'uz-kz-5',
        titleUz: 'Bojxona meʼyori: 10 000 USD gacha naqd pul deklaratsiyasiz',
        titleRu: 'Таможенные лимиты на наличную валюту до 10 000 USD',
        category: 'CURRENCY',
        isRequired: true,
        description: "10 000 AQSH dollari ekvivalentidan ortiq naqd pul qog'oz shaklda to'liq deklaratsiya qilinishi shart.",
      },
    ],
  },
  {
    id: 'chk-uz-kg',
    fromCountry: CountryCode.UZ,
    toCountry: CountryCode.KG,
    borderPoint: "Do'stlik (Andijon / O'sh) / Madaniyat",
    title: "O'zbekiston ➔ Qirg'iziston Chegara O'tish Talablari",
    description: "Farg'ona vodiysidan O'sh, Jalolobod va Bishkek tomon yo'l oluvchilar uchun ID-karta va xalqaro pasport qoidalari",
    version: '1.2',
    lastVerifiedAt: '2026-10-24T15:00:00Z',
    items: [
      {
        id: 'uz-kg-1',
        titleUz: 'ID-karta yoki Xorijga chiqish pasporti',
        titleRu: 'ID-карта или заграничный паспорт',
        category: 'PASSPORT',
        isRequired: true,
        description: "O'zbekiston va Qirg'iziston o'rtasidagi ikki tomonlama shartnomaga binoan ID-karta bilan o'tish mumkin (elektron qayd bilan).",
      },
      {
        id: 'uz-kg-2',
        titleUz: 'Yashil karta / Qirgʻiziston OSAGO sugʻurtasi',
        titleRu: 'Страховка ОСАГО КР для автотранспорта',
        category: 'VEHICLE',
        isRequired: true,
        description: "Avtotransport vositasini vaqtinchalik olib kirish hujjati rasmiylashtiriladi.",
      },
      {
        id: 'uz-kg-3',
        titleUz: 'Shaxsiy ehtiyojlar uchun ruxsat etilgan tovarlar meʼyori',
        titleRu: 'Нормы провоза товаров для личного пользования',
        category: 'CUSTOMS',
        isRequired: true,
        description: 'Bojxona tekshiruvida taqiqlangan dorivor vositalar (psixotrop moddalar roʻyxati) yoʻqligini tekshirish lozim.',
      },
    ],
  },
];

export interface AdminAuditEntry {
  id: string;
  staffName: string;
  staffRole: string;
  staffEmail: string;
  action: string;
  entity: string;
  entityId: string;
  ipAddress: string;
  diffSummary: string;
  timestamp: string;
}

export const mockAuditLogs: AdminAuditEntry[] = [
  {
    id: 'aud-701',
    staffName: 'Farrukh Developer',
    staffRole: 'SUPER_ADMIN',
    staffEmail: 'admin@otaxi.uz',
    action: 'DRIVER_VERIFICATION_APPROVED',
    entity: 'DriverProfile',
    entityId: 'drv-003',
    ipAddress: '185.139.137.45',
    diffSummary: "verificationStatus: PENDING_REVIEW ➔ APPROVED, verifiedBy: 'Farrukh Developer'",
    timestamp: '2026-10-27T17:45:12Z',
  },
  {
    id: 'aud-702',
    staffName: 'Kamola Karimova',
    staffRole: 'FINANCE_OPERATOR',
    staffEmail: 'finance@otaxi.uz',
    action: 'BOOKING_REFUND_PROCESSED',
    entity: 'Booking',
    entityId: 'bk-8905',
    ipAddress: '84.54.80.12',
    diffSummary: 'status: CANCELLED ➔ REFUNDED, refundAmount: 140000 UZS via Click',
    timestamp: '2026-10-27T16:20:00Z',
  },
  {
    id: 'aud-703',
    staffName: 'Farrukh Developer',
    staffRole: 'SUPER_ADMIN',
    staffEmail: 'admin@otaxi.uz',
    action: 'BORDER_CHECKLIST_UPDATED',
    entity: 'BorderChecklist',
    entityId: 'chk-uz-kz',
    ipAddress: '185.139.137.45',
    diffSummary: 'version: 1.3 ➔ 1.4, updated items: Qozog‘iston OGO sug‘urta talabi qo‘shildi',
    timestamp: '2026-10-27T14:15:30Z',
  },
  {
    id: 'aud-704',
    staffName: 'Bobur Rustamov',
    staffRole: 'MODERATOR',
    staffEmail: 'moderator1@otaxi.uz',
    action: 'DRIVER_VERIFICATION_REJECTED',
    entity: 'DriverProfile',
    entityId: 'drv-004',
    ipAddress: '213.230.100.9',
    diffSummary: "verificationStatus: PENDING ➔ REJECTED, reason: 'Haydovchilik guvohnomasi muddati tugagan'",
    timestamp: '2026-10-27T11:05:40Z',
  },
  {
    id: 'aud-705',
    staffName: 'Farrukh Developer',
    staffRole: 'SUPER_ADMIN',
    staffEmail: 'admin@otaxi.uz',
    action: 'COMMISSION_RATE_ADJUSTED',
    entity: 'PlatformSettings',
    entityId: 'cfg-commission',
    ipAddress: '185.139.137.45',
    diffSummary: 'defaultCommissionRate: 10% ➔ 12% (Xalqaro yo‘nalishlar uchun)',
    timestamp: '2026-10-26T18:00:00Z',
  },
];
