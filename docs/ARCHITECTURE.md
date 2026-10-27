# OTAXI Platform — Tizim Arxitekturasi va Muhandislik Qo'llanmasi (Architecture Manifesto)

| Maydon | Qiymat |
|---|---|
| Hujjat | OTAXI Enterprise Architecture Specification |
| Versiya | 1.0.0 (Production-Ready) |
| Sana | 2026-10-27 |
| Muallif | OTAXI Senior Platform & DevOps Muhandislik Jamoasi |
| Holat | Tasdiqlangan va amaliyotga joriy etilgan |

---

## 1. Kirish va Arxitektura Prinsiplari

**OTAXI** — Markaziy Osiyo (O'zbekiston, Qozog'iston, Qirg'iziston, Tojikiston) bo'ylab shaharlararo va xalqaro safarlarni xavfsiz, qulay va rejalashtirilgan tarzda amalga oshirishga mo'ljallangan yuqori yuklamali (high-concurrency) mobility marketplace platformasidir.

### Asosiy Muhandislik Prinsiplari:
1. **Modulli Monolitdan Xizmatlarga (Modular Monolith First):** Boshlang'ich bosqichda haddan tashqari tarqoq mikroservislar hosil qilmasdan, qat'iy domen chegaralariga (Domain-Driven Design) ega modulli NestJS arxitekturasi qo'llaniladi. Bu tranzaksiyalar yaxlitligini ta'minlaydi va keyinchalik mikroservislarga ajratishni osonlashtiradi.
2. **Tranzaksion Ishonchlilik va Idempotentlik:** Barcha moliyaviy amallar (to'lovlar, komissiya hisoblash, qaytarishlar/refund) va joy bron qilish operatsiyalari pessimistik qulflash (`SELECT FOR UPDATE`) va `idempotencyKey` mexanizmlari bilan race condition xavfidan himoyalangan.
3. **Chegara va Me'yoriy Muvofiqlik (Compliance by Design):** Xalqaro qatnovlarda mamlakatlararo qonuniy talablar (viza, biometrik pasport, avtosug'urta, bojxona deklaratsiyasi) platformaning yadrosiga chek-listlar ko'rinishida singdirilgan.
4. **Nol Ishonch Xavfsizligi (Zero-Trust & RBAC):** Har bir so'rov JWT bearer token orqali tekshiriladi; ma'muriy operatsiyalar qat'iy rollarga bo'lingan va o'zgartirib bo'lmaydigan audit jurnaliga (`AuditLog`) qayd etiladi.
5. **Yuqori Unumdorlik va Kesh:** Tez-tez so'raladigan qidiruv natijalari va geografik marshrutlar Redis keshida saqlanadi, og'ir vazifalar (SMS, Push, to'lov muddatini nazorat qilish) BullMQ navbatlarida asinxron bajariladi.

---

## 2. Umumiy Tizim Topologiyasi

Quyidagi diagrammada OTAXI tizimining foydalanuvchi interfeyslari, backend xizmatlari, ma'lumotlar bazalari va tashqi integratsiyalari o'rtasidagi o'zaro bog'liqlik ko'rsatilgan:

```mermaid
flowchart TB
    subgraph Clients["Mijoz Qatlamlari (Clients Layer)"]
        PA["Yo'lovchi Mobil / Web Ilovasi<br/>(React Native Expo / Next.js)"]
        DA["Haydovchi Mobil / Web Ilovasi<br/>(React Native Expo / Next.js)"]
        WA["Admin CRM & ERP Paneli<br/>(Next.js App Router + Tailwind)"]
    end

    subgraph Gateway["Yuklama Taqsimlovchi va Shlyuz"]
        NGINX["Nginx / Cloudflare Edge<br/>(SSL, Rate Limiting, DDoS Protection)"]
    end

    subgraph Backend["OTAXI Core Backend Engine (NestJS)"]
        API["REST API Router (Fastify/Express)"]
        WS["WebSocket Gateway (Socket.IO)"]
        
        subgraph Modules["Domen Modullari"]
            AUTH["Auth & Staff RBAC"]
            DRV["Driver & Vehicle Verification"]
            TRP["Trip & PostGIS Route Matcher"]
            BKG["Booking & Seat Locking Engine"]
            FIN["Payments & Driver Wallet Engine"]
            CHK["Border Checklist Manager"]
            AUD["Immutable Audit Logger"]
        end
        
        QUEUE["BullMQ Worker Engine<br/>(Background Jobs, SMS, Expirations)"]
    end

    subgraph Storage["Ma'lumotlar Saqlash Qatlami"]
        PG[("PostgreSQL 16 + PostGIS<br/>(Asosiy Tranzaksion Baza)")]
        RD[("Redis 7.x Cluster<br/>(Kesh, Sessiyalar, Geo-Tracking, PubSub)")]
        S3[("S3-Compatible Object Store<br/>(MinIO / Cloudflare R2 / AWS S3)")]
    end

    subgraph External["Tashqi Ekosistema Integratsiyalari"]
        PAY["To'lov Tizimlari:<br/>Payme • Click • Uzum • Kaspi"]
        SMS["SMS Shlyuz:<br/>Eskiz.uz / PlayMobile"]
        FCM["Push Xabarnomalar:<br/>Firebase Cloud Messaging"]
        MAPS["Geolokatsiya va Xaritalar:<br/>MapLibre / Google Maps"]
    end

    PA --> NGINX
    DA --> NGINX
    WA --> NGINX

    NGINX --> API
    NGINX --> WS

    API --> Modules
    WS --> TRP
    WS --> RD

    Modules --> PG
    Modules --> RD
    Modules --> S3
    Modules --> QUEUE

    QUEUE --> SMS
    QUEUE --> FCM
    FIN --> PAY
    TRP --> MAPS
```

---

## 3. Asosiy Ma'lumotlar Oqimlari va Tranzaksiyalar

### 3.1 Joy Bron Qilish va Race-Condition Himoyasi (Booking & Seat Lock)

Ikki yo'lovchi bir vaqtda so'nggi bo'sh joyni bron qilib qo'yishining oldini olish uchun bazada qat'iy tranzaksion izolyatsiya va vaqtincha bron (Temporary Reservation) holati qo'llaniladi:

```mermaid
sequenceDiagram
    autonumber
    actor P as Yo'lovchi
    participant B as Backend API
    participant R as Redis Lock
    participant DB as PostgreSQL (Prisma)
    participant Q as BullMQ Navbati
    participant Pay as To'lov Provayderi (Payme/Click)

    P->>B: POST /bookings (tripId, seatCount, idempotencyKey)
    B->>R: Distributed Lock olish (trip:{tripId})
    R-->>B: Lock berildi
    
    B->>DB: BEGIN TRANSACTION (SELECT availableSeats FROM Trip FOR UPDATE)
    alt Joy yetarli emas
        B-->>P: 409 Conflict: "Kechirasiz, tanlangan joylar band qilingan"
    else Joy yetarli
        B->>DB: availableSeats = availableSeats - seatCount
        B->>DB: INSERT INTO Booking (status: PENDING_PAYMENT, expiresAt: now() + 10 min)
        B->>DB: COMMIT TRANSACTION
        B->>R: Lockni bo'shatish
        B->>Q: 10 daqiqalik kechiktirilgan job qo'shish (cancel_expired_booking)
        B-->>P: 201 Created (bookingId, paymentUrl, expiresAt)
    end

    P->>Pay: To'lovni amalga oshiradi
    Pay->>B: POST /payments/webhook (transactionId, status: SUCCESS)
    B->>DB: Booking holatini CONFIRMED ga yangilash
    B->>DB: Haydovchi hisobiga tushumni yozish (driverEarnings)
    B->>DB: Platforma komissiyasini qayd etish (commissionAmount)
    B-->>P: Push / SMS: "Safaringiz tasdiqlandi. Bort kodi: 4921"
```

---

### 3.2 Haydovchi Hujjatlarini Tekshirish va Moderatsiya Oqimi

```mermaid
sequenceDiagram
    autonumber
    actor D as Haydovchi
    participant API as Backend API
    participant S3 as S3 Hujjatlar Saqlagichi
    actor M as Admin / Moderator
    participant AUD as Audit Jurnali

    D->>API: POST /drivers/verification/documents (Litsenziya, Texpasport, Mashina rasmi)
    API->>S3: Hujjat fayllarini shifrlangan holda saqlash
    API->>API: Status: PENDING_REVIEW
    API-->>M: Webhook / WebSocket: "Yangi haydovchi arizasi kelib tushdi"

    M->>API: GET /admin/verifications/{id} (Hujjatlarni ko'rish)
    alt Hujjatlar talabga to'liq javob bersa
        M->>API: POST /admin/verifications/{id}/approve
        API->>API: Status: APPROVED
        API->>AUD: Yozish: DRIVER_VERIFICATION_APPROVED (moderatorId, timestamp, ip)
        API-->>D: Push: "Profilingiz tasdiqlandi! Reys yaratishingiz mumkin."
    else Hujjat muddati o'tgan yoki xira bo'lsa
        M->>API: POST /admin/verifications/{id}/reject (reason: "Litsenziya muddati tugagan")
        API->>API: Status: REJECTED (rejectionReason)
        API->>AUD: Yozish: DRIVER_VERIFICATION_REJECTED (reason, moderatorId)
        API-->>D: Push / SMS: "Arizangiz rad etildi: Litsenziya muddati tugagan. Qaytadan yuklang."
    end
```

---

## 4. Xavfsizlik, Maxfiylik va Huquqiy Muvofiqlik

1. **Maxfiy Ma'lumotlar Himoyasi:**
   - Hech qanday API kalitlar, ma'lumotlar bazasi parollari yoki JWT sirlari git repozitoriyasiga kiritilmaydi. Barcha sirlar faqat `.env` va xavfsiz CI/CD Secret Store orqali inyeksiyalanadi.
   - Foydalanuvchilarning telefon raqamlari va shaxsiy hujjatlari saqlashda AES-256 shifrlash bilan himoyalanadi.
2. **Qonuniy Muvofiqlik (O'zbekiston Respublikasi "Shaxsiy ma'lumotlar to'g'risida"gi O'RQ-547 qonuni):**
   - O'zbekiston fuqarolarining shaxsiy ma'lumotlar bazasi jismoniy jihatdan O'zbekiston hududida joylashgan serverlarda saqlanadi.
   - Xalqaro safarlarda faqat yo'lovchi o'zi ruxsat bergan chegaradan o'tish ma'lumotlari qayta ishlanadi.
3. **Audit va O'zgarmaslik (Immutable Audit Ledger):**
   - Barcha ma'muriy aralashuvlar (haydovchini tasdiqlash/bloklash, to'lovni qaytarish, komissiya tariflarini o'zgartirish, chegara talablarini yangilash) `AuditLog` jadvaliga xodimning ID si, IP-manzili, aniq `diff` obyekti va server vaqti bilan yoziladi.
   - Audit yozuvlarini o'chirish yoki tahrirlash dasturiy darajada qat'iyan taqiqlangan (`ON DELETE RESTRICT`).

---

## 5. Masshtablash va Yuqori Yuklama (Scalability & HA Strategy)

1. **Geografik Qidiruvlar Optimallashtirilishi:**
   - PostgreSQL `PostGIS` kengaytmasi orqali koordinatalar bo'yicha indeksatsiya (`GIST (geom)`).
   - Marshrut bo'yicha oraliq to'xtash joylarini (Waypoints) qidirishda spatial radius so'rovlari 50ms dan kam vaqt oladi.
2. **Ma'lumotlar Bazasi Ulanishlari:**
   - `PgBouncer` orqali connection pooling amalga oshiriladi (2000+ parallel ulanishlar uchun xotira tejash).
3. **Kesh Qatlamlari:**
   - Ommabop qidiruv yo'nalishlari (masalan, Toshkent ➔ Samarqand) Redisda 60 soniyalik TTL bilan keshlanadi.
   - Jonli GPS joylashuv koordinatalari to'g'ridan-to'g'ri Redis GEO (`GEOADD`, `GEORADIUS`) buyruqlari orqali ishlanadi va har 15 soniyada agregatsiya qilinadi.
4. **Konteynerlashtirish va CI/CD:**
   - Monorepo `turbo` bilan keshlanadi va Docker konteynerlariga joylashtiriladi.
   - GitHub Actions orqali avtomatik linter, tur tekshiruvi (typecheck), testlar va production deploy ta'minlanadi.

---

*Hujjat OTAXI texnik arxitektura kengashi tomonidan tasdiqlangan.*
