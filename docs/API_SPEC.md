# OTAXI Platform — API Spesifikatsiyasi (REST & WebSocket Events)

| Maydon | Qiymat |
|---|---|
| Protokol | HTTP/2, REST (JSON), WebSocket (Socket.IO) |
| Asosiy URL | `https://api.otaxi.uz/api/v1` |
| Autentifikatsiya | Bearer JWT (Access Token muddati: 15 daqiqa, Refresh Token: 30 kun) |
| Idempotentlik | `X-Idempotency-Key` (UUIDv4) barcha `POST` va `PATCH` to'lov/bron so'rovlarida |

---

## 1. REST API Xaritasi

### 1.1 Autentifikatsiya va Profil (`/auth`)

| Metod | Endpoint | Tavsif | Kirish huquqi |
|---|---|---|---|
| `POST` | `/auth/request-otp` | Telefon raqamiga bir martalik SMS kod yuborish | Ommaviy |
| `POST` | `/auth/verify-otp` | SMS kodni tasdiqlash va JWT token juftligini olish | Ommaviy |
| `POST` | `/auth/refresh` | Yangi Access Token olish (Refresh Token orqali) | Ommaviy |
| `GET` | `/auth/me` | Joriy tizimga kirgan foydalanuvchi profili | Barcha rollar |
| `PATCH` | `/auth/profile` | Foydalanuvchi ism-familiyasi, avatarini yangilash | Barcha rollar |

---

### 1.2 Haydovchilar va Hujjat Moderatsiyasi (`/drivers`)

| Metod | Endpoint | Tavsif | Kirish huquqi |
|---|---|---|---|
| `POST` | `/drivers/register` | Haydovchi profilini yaratish | `PASSENGER` |
| `POST` | `/drivers/documents` | Hujjat yuklash (guvohnoma, texpasport, sug'urta) | `DRIVER` |
| `POST` | `/drivers/vehicles` | Yangi avtomobil ma'lumotlarini kiritish | `DRIVER` |
| `GET` | `/drivers/profile` | Haydovchi profili, reyting va hamyon holati | `DRIVER` |
| `GET` | `/drivers/trips` | Haydovchining o'z reyslari tarixi | `DRIVER` |

---

### 1.3 Reyslar Boshqaruvi (`/trips`)

| Metod | Endpoint | Tavsif | Kirish huquqi |
|---|---|---|---|
| `GET` | `/trips/search` | Shaharlar, sana va joylar bo'yicha reys qidirish | Ommaviy |
| `GET` | `/trips/:id` | Reysning to'liq ma'lumoti, to'xtash joylari va haydovchi | Ommaviy |
| `POST` | `/trips` | Yangi reys e'lon qilish (jo'nash, kelish, narx, o'rindiqlar) | Faqat tasdiqlangan `DRIVER` |
| `PATCH` | `/trips/:id/status` | Reys holatini yangilash (`PUBLISHED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`) | `DRIVER`, `ADMIN` |
| `POST` | `/trips/:id/stops` | Qatnovga oraliq to'xtash shaharlarini qo'shish | `DRIVER` |

---

### 1.4 Buyurtmalar va Joy Bron Qilish (`/bookings`)

| Metod | Endpoint | Tavsif | Kirish huquqi |
|---|---|---|---|
| `POST` | `/bookings` | Reysda joy bron qilish (10 daqiqalik vaqtinchalik lock) | `PASSENGER` |
| `GET` | `/bookings/:id` | Buyurtma tafsiloti, to'lov holati va bort kodi | Egasi, `ADMIN` |
| `GET` | `/bookings/my` | Foydalanuvchining o'z buyurtmalari ro'yxati | `PASSENGER` |
| `POST` | `/bookings/:id/cancel` | Buyurtmani bekor qilish (qoidalarga ko'ra jarima/qaytarish) | Egasi, `ADMIN` |
| `POST` | `/bookings/:id/verify-code` | Haydovchi tomonidan 4-xonali bort kodini tasdiqlash | `DRIVER` |

---

### 1.5 To'lovlar va Haydovchi Hamyoni (`/payments`)

| Metod | Endpoint | Tavsif | Kirish huquqi |
|---|---|---|---|
| `POST` | `/payments/checkout` | To'lov sessiyasini yaratish (Payme, Click, Uzum) | `PASSENGER` |
| `POST` | `/payments/webhook/:provider` | To'lov tizimlaridan keladigan tranzaksiya webhooki | Tashqi tizimlar |
| `GET` | `/payments/:id/receipt` | Rasmiy to'lov kvitansiyasini (fiskal chek) olish | Egasi, `ADMIN` |
| `GET` | `/wallet/transactions` | Haydovchining daromad va yechib olishlar tarixi | `DRIVER` |
| `POST` | `/wallet/payout` | Haydovchi kartasiga pul yechib berish so'rovi | `DRIVER` |

---

### 1.6 Chegara Chek-listlari (`/checklists`)

| Metod | Endpoint | Tavsif | Kirish huquqi |
|---|---|---|---|
| `GET` | `/checklists/:from/:to` | Ikki mamlakat o'rtasidagi chegaradan o'tish talablari (UZ ➔ KZ, UZ ➔ KG) | Ommaviy |
| `POST` | `/checklists/:from/:to/items` | Yangi chegara talab bandini qo'shish | `ADMIN`, `MODERATOR` |
| `PUT` | `/checklists/:id` | Mavjud chek-list bandlarini yangilash va versiyani oshirish | `ADMIN` |
| `DELETE` | `/checklists/items/:itemId` | Chek-list bandini o'chirish | `ADMIN` |

---

### 1.7 Admin CRM & ERP API (`/admin`)

| Metod | Endpoint | Tavsif | Kirish huquqi |
|---|---|---|---|
| `GET` | `/admin/kpi/summary` | Real vaqtdagi KPIlar (GMV, komissiya, buyurtmalar, haydovchilar) | `ADMIN`, `FINANCIER` |
| `GET` | `/admin/verifications` | Moderatsiya kutilayotgan haydovchilar ro'yxati | `ADMIN`, `MODERATOR` |
| `POST` | `/admin/verifications/:id/approve` | Haydovchi hujjatlarini bir tugma bilan tasdiqlash | `ADMIN`, `MODERATOR` |
| `POST` | `/admin/verifications/:id/reject` | Haydovchi arizasini sabab ko'rsatib rad etish | `ADMIN`, `MODERATOR` |
| `POST` | `/admin/bookings/:id/refund` | Buyurtmani bekor qilish va pulni to'liq/qisman qaytarish | `ADMIN`, `FINANCIER` |
| `GET` | `/admin/audit` | Tizimdagi harakatlar audit jurnali ro'yxati | `ADMIN` |

---

## 2. WebSocket Real-time Eventlari (Socket.IO)

Barcha WebSocket ulanishlari `wss://api.otaxi.uz/socket.io/` orqali JWT token bilan himoyalangan.

### 2.1 Haydovchi GPS Lokatsiyasi (Driver Geo Stream)

- **Namespace:** `/tracking`
- **Mijozdan Serverga (Client ➔ Server):**
  ```json
  event: "driver:location_update"
  {
    "driverId": "drv-001",
    "tripId": "trp-901",
    "latitude": 41.311081,
    "longitude": 69.240562,
    "speed": 78.5,
    "bearing": 185.0,
    "timestamp": "2026-10-27T17:45:10Z"
  }
  ```
- **Serverdan Yo'lovchiga (Server ➔ Passenger Room `trip:{tripId}`):**
  ```json
  event: "trip:driver_moved"
  {
    "tripId": "trp-901",
    "latitude": 41.311081,
    "longitude": 69.240562,
    "speed": 78.5,
    "estimatedArrival": "2026-10-28T19:00:00Z"
  }
  ```

### 2.2 Buyurtma va Joy Statusi O'zgarishi

- **Serverdan Mijozga (Broadcast):**
  ```json
  event: "trip:seats_updated"
  {
    "tripId": "trp-901",
    "availableSeats": 1,
    "totalSeats": 4
  }
  ```
- **Haydovchiga Yangi Bron Xabarnomasi (Direct to Driver):**
  ```json
  event: "booking:new_reserved"
  {
    "bookingId": "bk-8901",
    "passengerName": "Bobur M.",
    "seatCount": 2,
    "route": "Toshkent ➔ Olmaota"
  }
  ```

---

*Hujjat OTAXI backend arxitektura bo'limi tomonidan tasdiqlangan.*
