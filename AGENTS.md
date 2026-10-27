# 🤖 AGENTS.md — OTAXI AI Coding Assistant Guidelines & Protocols

> **Auditoriya:** Barcha sun'iy intellekt agentlari (Antigravity, Cursor, Claude Code, GitHub Copilot, Gemini CLI) ushbu repozitoriyada kod yozishda, tahrirlashda va arxitekturaviy o'zgarishlar kiritishda ushbu qoidalarga 100% rioya qilishi shart.

---

## 🎯 1. ASOSIY TAMOYILLAR (Senior Engineer Protocol)

1. **Faqat Production-Ready Kod:** 
   - Hech qachon `// ... rest of code ...`, `// TODO: implement later` yoki chala funksiyalarni yozmang.
   - Har bir funksiya, metod va kontroller to'liq, xatoliklar qamrab olingan (try/catch, edge cases) va ishlaydigan holatda bo'lishi shart.
2. **Qat'iy Tip Xavfsizligi (Strict TypeScript):**
   - Hech qayerda `any` tipidan foydalanmang.
   - Har bir funksiya argumenti va qaytarish tipi aniq yozilishi shart.
   - O'zgarish kiritgach, doimo `pnpm typecheck` orqali tekshiring.
3. **Monorepo Chegaralari (Boundary Isolation):**
   - `apps/mobile` dan `apps/backend` ga yoki aksincha to'g'ridan-to'g'ri nisbiy yo'l bilan (relative import `../../apps/...`) fayl chaqirish QAT'IYAN TAQIQLANADI!
   - Umumiy turlar faqat `@otaxi/types` orqali, umumiy UI faqat `@otaxi/ui` orqali import qilinadi.

---

## 🏛️ 2. BACKEND QOIDALARI (`apps/backend` — NestJS + Prisma)

1. **Atomik Tranzaksiyalar (Concurrency & Race Conditions):**
   - O'rindiqlarni band qilish (`Booking`) yoki bekor qilishda doimo Prisma `$transaction` dan foydalaning.
   - O'rindiq kamaytirishda atomik tekshiruv shart:
     ```typescript
     await prisma.trip.update({
       where: { id: tripId, availableSeats: { gte: requestedSeats } },
       data: { availableSeats: { decrement: requestedSeats } },
     });
     ```
2. **Idempotentlik va Moliya:**
   - Har qanday to'lov yoki hamyon (`wallet`) o'zgarishida `idempotencyKey` talab qilinadi.
   - Pul summalari `number` (float) ko'rinishida emas, `Decimal(10, 2)` yoki tiyinlarda hisoblanishi shart.
3. **Validatsiya va DTOlar:**
   - Har bir kontroller uchun `class-validator` va `class-transformer` bilan yozilgan alohida DTO bo'lishi shart (`@IsString()`, `@IsUUID()`, `@IsEnum()`, `@Min()`).
4. **Vaqt va Zonalar:**
   - Bazada barcha vaqtlar UTC formatida saqlanadi. Foydalanuvchiga ko'rsatishda `Asia/Tashkent` vaqti hisobga olinadi.

---

## 📱 3. MOBIL ILOVA QOIDALARI (`apps/mobile` — React Native + Expo)

1. **Rejim Boshqaruvi (In-Drive Model):**
   - Ilovada `AppContext` orqali `activeMode` boshqariladi: `'passenger'` ⟷ `'driver'`.
   - Yangi ekranlar tegishli navigatsiya stakiga (`PassengerNavigator` yoki `DriverNavigator`) qo'shiladi.
2. **Xavfsiz Zona (Safe Area):**
   - Har qanday ekranda `react-native-safe-area-context` dan foydalaning (iOS notch va Android navigation bar bilan to'qnashmasligi uchun).
3. **Zaif Tarmoq (Patchy Connection) Bardoshligi:**
   - Shaharlararo magistral yo'llarda (masalan: Qamchiq dovoni yoki cho'l hududlarida) internet uzilishi mumkin.
   - Haydovchi GPS koordinatalari tarmoq yo'qligida lokal navbatga yozilib, internet paydo bo'lishi bilan serverga paketlab jo'natilishi kerak.
4. **Xalqaro Chegara Chek-listi:**
   - Xalqaro reyslarda (`isInternational === true`) foydalanuvchiga to'lovdan oldin `BorderChecklistModal` ko'rsatilishi shart.

---

## 🖥️ 4. ADMIN CRM QOIDALARI (`apps/web-admin` — Next.js 15)

1. **App Router Konvensiyasi:**
   - Har bir modul o'z papkasida `page.tsx` va kerak bo'lsa `loading.tsx`, `error.tsx` ga ega bo'lishi kerak.
2. **Server va Client Komponentlar:**
   - Standart holatda komponentlar Server Component bo'lishi kerak. Faqat interaktiv holat (state, form, event listener) bo'lsagina `'use client'` direktivasi qo'shiladi.
3. **Audit Jurnali:**
   - Moderator yoki admin tomonidan bajarilgan har qanday harakat (haydovchini tasdiqlash, rad etish, pul qaytarish, chek-list o'zgartirish) `AuditLog` ga yozilishi shart.

---

## 🧪 5. ISHNI YAKUNLASHDA TEKSHIRUV CHEK-LISTI (Self-Check)

Har qanday AI vazifani yakunlagan deb e'lon qilishdan oldin quyidagi tekshiruvlarni bajarishi shart:

```bash
# 1. Turlarni tekshirish (0 xato bo'lishi shart)
pnpm typecheck

# 2. Build jarayonini tekshirish
pnpm build

# 3. Git holatini tekshirish (hech qanday .env yoki sir kirmaganligini tekshirish)
git status
```

Ushbu qoidalarga qat'iy rioya qiling. Kod sifati — bizning eng yuqori qadriyatimizdir.
