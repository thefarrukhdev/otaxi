# 🤝 OTAXI Monorepo — Jamoadoshlar uchun Ishlash Qoidalari (CONTRIBUTING)

Ushbu hujjat **OTAXI** platformasida samarali, ziddiyatsiz va yuqori darajada tartibli ishlash uchun asosiy qoidalar to'plamidir.

---

## 👥 1. Jamoa Rollari va Mas'uliyat Hududlari

| Ism | Rol | Asosiy Ish Hududi | Mas'uliyat |
|---|---|---|---|
| **Farrukh** | Frontend Lead | `apps/mobile/`<br>`apps/web-admin/`<br>`packages/ui/` | React Native (Expo) mobil ilovasi (iOS/Android), Next.js Admin CRM, umumiy UI komponentlari va UX. |
| **Ravshan** | Backend Lead | `apps/backend/`<br>`apps/backend/prisma/` | NestJS API, PostgreSQL (PostGIS) ma'lumotlar bazasi, Redis navbatlari, WebSocket treking, to'lovlar va xavfsizlik. |
| **Ikkalasi** | Core Architecture | `packages/types/`<br>`docs/` | Baza modellari, DTOlar, API kontraktlari va umumiy arxitekturaviy kelishuvlar. |

---

## 🏗️ 2. Yagona Haqiqat Manbasi: `@otaxi/types`

Backend va Frontend o'rtasida ma'lumot uzatishdagi xatoliklarni oldini olish uchun:
1. Har qanday yangi model, enum, status yoki API javob formati **faqat va faqat** `packages/types/src/` ichida e'lon qilinadi.
2. **Ravshan uchun:** Yangi endpoint ochishdan oldin, kerakli DTO va response interfeysini `@otaxi/types` ga qo'shing yoki yangilang.
3. **Farrukh uchun:** Mobil ilova yoki Adminda turlarni qayta yozmang, to'g'ridan-to'g'ri `@otaxi/types` dan import qiling.
4. Paketni o'zgartirgach, quyidagi buyruqni bering:
   ```bash
   pnpm --filter @otaxi/types build
   ```

---

## 🌿 3. Git Branching va Ish Oqimi (Workflow)

### Branch nomlash qoidalari:
- `feature/backend-[vazifa-nomi]` — Ravshan uchun (masalan: `feature/backend-payme-webhook`)
- `feature/mobile-[vazifa-nomi]` — Farrukh uchun (masalan: `feature/mobile-booking-flow`)
- `feature/admin-[vazifa-nomi]` — Admin panel uchun (masalan: `feature/admin-driver-moderation`)
- `fix/[muammo-nomi]` — Kutilmagan nosozliklarni tuzatish uchun

### Commit xabarlari formati (Conventional Commits):
Har bir commit aniq va tushunarli bo'lishi shart:
- `feat(trips): add international route search with filter`
- `fix(booking): prevent race condition on concurrent seat reservations`
- `refactor(auth): simplify phone otp verification logic`
- `docs(api): update swagger spec for driver payout endpoint`
- `chore(deps): update expo sdk to latest patch`

---

## 💻 4. Mahalliy Ish Muhiti (Local Development)

### Boshlang'ich o'rnatish:
```bash
# 1. Repozitoriyani yuklab olish
git clone git@github.com:thefarrukhdev/otaxi.git
cd otaxi

# 2. Bog'liqliklarni o'rnatish
pnpm install

# 3. Docker orqali PostgreSQL va Redisni yoqish
pnpm docker:up

# 4. Prisma sxemasini generatsiya qilish va migratsiya
pnpm --filter @otaxi/backend prisma:generate
pnpm --filter @otaxi/backend prisma:migrate
pnpm backend:seed
```

### Ishga tushirish buyruqlari:
```bash
pnpm dev:backend   # NestJS API (http://localhost:4000/docs)
pnpm dev:mobile    # React Native Expo (iOS & Android)
pnpm dev:admin     # Next.js Admin CRM (http://localhost:3002)
pnpm build         # Butun monoreponi yig'ish
pnpm typecheck     # TypeScript tekshiruvi (0 ta xato bo'lishi shart)
pnpm lint          # Kod uslubi tekshiruvi
pnpm format        # Prettier bilan formatlash
```

---

## 🔒 5. Xavfsizlik Qoidalari (Zero Secrets Protocol)

1. **Hech qachon kodga sirlarni yozmang:** API kalitlar, to'lov provayderi maxfiy so'zlari, JWT sirlari faqat `.env` da saqlanadi.
2. Har qanday yangi o'zgaruvchi qo'shilsa, uning namunasi `.env.example` fayliga kiritilishi shart.
3. Commit qilishdan oldin `git status` va `git diff` orqali hech qanday `.env` yoki shaxsiy konfiguratsiya kirmaganligiga ishonch hosil qiling.

---

## 🧪 6. Pull Request (PR) topshirish chek-listi:

Har qanday PR yuborishdan oldin dasturchi o'z kompyuterida quyidagilarni tekshirishi shart:
- [ ] `pnpm typecheck` — 0 ta xato bilan o'tishi kerak.
- [ ] `pnpm build` — yig'ish jarayonida xatolik chiqmasligi kerak.
- [ ] Kodingizda hech qanday `TODO`, `console.log` yoki vaqtinchalik placeholderlar qolmagan.
- [ ] O'zgarishlar tegishli lead (Farrukh yoki Ravshan) tomonidan ko'rib chiqilgan (Review).
