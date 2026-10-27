import { PrismaClient, UserRole, UserStatus, VerificationStatus, DocumentType, TripStatus, Currency, CountryCode } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding OTAXI database...');

  // 1. Create Admin
  const admin = await prisma.user.upsert({
    where: { phone: '+998900000001' },
    update: {},
    create: {
      phone: '+998900000001',
      fullName: 'OTAXI Bosh Administrator',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      preferredLanguage: 'uz',
      staffProfile: {
        create: {
          department: 'HEADQUARTERS',
          permissions: ['ALL'],
          isTwoFactorEnabled: true,
        },
      },
    },
  });

  // 2. Create Passenger
  const passenger = await prisma.user.upsert({
    where: { phone: '+998941112233' },
    update: {},
    create: {
      phone: '+998941112233',
      fullName: 'Dilnoza Karimova',
      role: UserRole.PASSENGER,
      status: UserStatus.ACTIVE,
      preferredLanguage: 'uz',
    },
  });

  // 3. Create Drivers with Vehicles & Verified Profiles
  const driverUser1 = await prisma.user.upsert({
    where: { phone: '+998909876543' },
    update: {},
    create: {
      phone: '+998909876543',
      fullName: 'Jamshid Rahimov',
      role: UserRole.DRIVER,
      status: UserStatus.ACTIVE,
      preferredLanguage: 'uz',
      driverProfile: {
        create: {
          verificationStatus: VerificationStatus.APPROVED,
          verifiedAt: new Date(),
          rating: 4.9,
          totalTrips: 142,
          totalReviews: 88,
          walletBalance: 850000.0,
          vehicles: {
            create: {
              make: 'Chevrolet',
              model: 'Cobalt',
              color: 'Oq (White)',
              year: 2023,
              licensePlate: '01A777AA',
              totalSeats: 4,
              hasAirConditioner: true,
              hasLuggageSpace: true,
              photos: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'],
            },
          },
        },
      },
    },
    include: {
      driverProfile: {
        include: { vehicles: true },
      },
    },
  });

  const driverUser2 = await prisma.user.upsert({
    where: { phone: '+998912345678' },
    update: {},
    create: {
      phone: '+998912345678',
      fullName: 'Farruxbek Aliyev',
      role: UserRole.DRIVER,
      status: UserStatus.ACTIVE,
      preferredLanguage: 'uz',
      driverProfile: {
        create: {
          verificationStatus: VerificationStatus.APPROVED,
          verifiedAt: new Date(),
          rating: 5.0,
          totalTrips: 210,
          totalReviews: 140,
          walletBalance: 2400000.0,
          vehicles: {
            create: {
              make: 'Toyota',
              model: 'Camry 70',
              color: 'Qora (Black)',
              year: 2022,
              licensePlate: '01Z999ZZ',
              totalSeats: 4,
              hasAirConditioner: true,
              hasLuggageSpace: true,
              photos: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=600&q=80'],
            },
          },
        },
      },
    },
    include: {
      driverProfile: {
        include: { vehicles: true },
      },
    },
  });

  // 4. Create Trips (Domestic & International)
  if (driverUser1.driverProfile && driverUser1.driverProfile.vehicles[0]) {
    const departure1 = new Date();
    departure1.setDate(departure1.getDate() + 1);
    departure1.setHours(8, 0, 0, 0);

    const arrival1 = new Date(departure1);
    arrival1.setHours(12, 30, 0, 0);

    await prisma.trip.create({
      data: {
        driverId: driverUser1.driverProfile.id,
        vehicleId: driverUser1.driverProfile.vehicles[0].id,
        originCity: 'Toshkent',
        originCountry: CountryCode.UZ,
        originAddress: 'Olmazor metro bekati',
        destinationCity: 'Samarqand',
        destinationCountry: CountryCode.UZ,
        destinationAddress: 'Registon maydoni atrofi',
        departureTime: departure1,
        estimatedArrivalTime: arrival1,
        totalSeats: 4,
        availableSeats: 3,
        pricePerSeat: 120000.0,
        currency: Currency.UZS,
        isInternational: false,
        status: TripStatus.PUBLISHED,
        allowLuggage: true,
        notes: 'Konditsioner bor, chekilmaydi. Katta yuklar bepul.',
      },
    });
  }

  if (driverUser2.driverProfile && driverUser2.driverProfile.vehicles[0]) {
    const departure2 = new Date();
    departure2.setDate(departure2.getDate() + 2);
    departure2.setHours(7, 0, 0, 0);

    const arrival2 = new Date(departure2);
    arrival2.setHours(13, 0, 0, 0);

    await prisma.trip.create({
      data: {
        driverId: driverUser2.driverProfile.id,
        vehicleId: driverUser2.driverProfile.vehicles[0].id,
        originCity: 'Toshkent',
        originCountry: CountryCode.UZ,
        originAddress: 'Gisht-Koprik (Chernyayevka) chegara posti',
        destinationCity: 'Shymkent',
        destinationCountry: CountryCode.KZ,
        destinationAddress: 'Mega Planet SM, Shymkent',
        departureTime: departure2,
        estimatedArrivalTime: arrival2,
        totalSeats: 4,
        availableSeats: 4,
        pricePerSeat: 250000.0,
        currency: Currency.UZS,
        isInternational: true,
        status: TripStatus.PUBLISHED,
        allowLuggage: true,
        notes: 'Xalqaro reys. Chegara chek-listi talab qilinadi. Barcha xalqaro sug`urta va ruxsatnomalar mavjud.',
      },
    });
  }

  // 5. Seed International Border Checklists (PRD Appendix 22)
  await prisma.borderChecklist.upsert({
    where: {
      fromCountry_toCountry: {
        fromCountry: CountryCode.UZ,
        toCountry: CountryCode.KZ,
      },
    },
    update: {},
    create: {
      fromCountry: CountryCode.UZ,
      toCountry: CountryCode.KZ,
      title: 'O`zbekiston ➔ Qozog`iston chegarasidan o`tish qoidalari',
      description: 'Gisht-Ko`prik (Chernyayevka) va Yallama xalqaro o`tish punktlari uchun tasdiqlangan hujjatlar va bojxona tartibi.',
      version: '1.0',
      items: [
        {
          id: 'kz-passport',
          title: {
            uz: 'Xorijga chiqish pasporti (Qizil pasport)',
            ru: 'Заграничный паспорт',
            en: 'International Passport',
          },
          description: {
            uz: 'Muddati kamida 6 oy amalda bo`lishi shart.',
            ru: 'Срок действия должен быть не менее 6 месяцев.',
            en: 'Must be valid for at least 6 months.',
          },
          isRequired: true,
          category: 'PASSPORT',
        },
        {
          id: 'kz-visa',
          title: {
            uz: '30 kungacha vizasiz rejim',
            ru: 'Безвизовый режим до 30 дней',
            en: 'Visa-free entry up to 30 days',
          },
          description: {
            uz: 'O`zbekiston fuqarolari Qozog`istonda 30 kungacha ro`yxatdan o`tmasdan qolishi mumkin.',
            ru: 'Граждане Узбекистана могут находиться в Казахстане до 30 дней без регистрации.',
            en: 'Citizens of Uzbekistan can stay up to 30 days without registration.',
          },
          isRequired: false,
          category: 'VISA',
        },
        {
          id: 'kz-children',
          title: {
            uz: 'Voyaga yetmagan bolalar uchun notarial ruxsatnoma',
            ru: 'Нотариальное согласие на выезд детей',
            en: 'Notarized permission for minors',
          },
          description: {
            uz: 'Agar bola ota-onaning faqat biri yoki hamrohsiz ketsa, notarial ruxsatnoma shart.',
            ru: 'Требуется, если ребенок едет только с одним родителем или с третьим лицом.',
            en: 'Required if a minor travels with only one parent or a guardian.',
          },
          isRequired: true,
          category: 'CHILDREN',
        },
        {
          id: 'kz-currency',
          title: {
            uz: 'Naqd valyuta deklaratsiyasi',
            ru: 'Декларация наличной валюты',
            en: 'Cash currency declaration',
          },
          description: {
            uz: '10 000 AQSh dollaridan ortiq naqd pul bo`lsa, majburiy yozma deklaratsiya to`ldiriladi.',
            ru: 'Суммы свыше $10 000 подлежат обязательному декларированию.',
            en: 'Amounts exceeding $10,000 must be declared in writing.',
          },
          isRequired: true,
          category: 'CURRENCY',
        },
      ],
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
