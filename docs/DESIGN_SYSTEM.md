# 🎨 OTAXI Mobile — Senior UI/UX Design System & Experience Architecture

> **Versiya:** 1.0 (2026 Trend-Setting Mobility Standard)  
> **Platforma:** iOS (App Store) & Android (Google Play Market)  
> **Asosiy Falsafa:** *Neo-Mobility & Tactile Ergonomics* — Shaharlararo va xalqaro safarlarni samolyot chiptasidek ishonchli, taksidek oson va xalqaro standartda qulay qilish.

---

## 🧭 1. DIZAYN FALSAFASI VA PSIXOLOGIYASI

Markaziy Osiyoda shaharlararo qatnovchi yo'lovchilar va haydovchilar quyidagi o'ziga xos sharoitlarda ilovadan foydalanadi:
- **Katta quyosh nuri:** Kunduzi cho'l va tog' yo'llarida ekranning ko'rinishi yuqori kontrastni talab qiladi.
- **Tungi magistral yo'llar:** Tunda haydovchi ko'zini qamashtirmaslik uchun avtomatik / doimiy to'q mavzu (Dark Cockpit) kerak.
- **Bir qo'l bilan boshqarish (Thumb Zone):** Yo'lda, sumka ko'tarib yoki rulda bo'lganda barcha asosiy tugmalar ekranning pastki 50% qismida joylashishi shart.
- **Til xilma-xilligi:** O'zbek, Rus, Qoraqalpoq, Qozoq, Qirg'iz va Ingliz tillarida matn uzunligi 40% gacha o'zgarishi mumkin — dizayn moslashuvchan (auto-responsive) bo'lishi shart.

---

## 🎨 2. IKKI REJIMLI RANG PALITRASI (DUAL THEME ENGINE)

OTAXI ilovasida inDrive modeli bo'yicha **ikkita alohida rang va atmosfera dunyosi** mavjud:

### 🌿 A. Yo'lovchi Rejimi: "Emerald Oasis" (Xavfsizlik, Ishonch va Yangilik)
Yo'lovchiga xotirjamlik, rasmiy tekshirilganlik va xavfsizlik hissini beradi.

| Rang Nomi | Hex Kodi | Qo'llanish O'rni |
|---|---|---|
| **Primary Emerald** | `#059669` | Asosiy harakat tugmalari, tasdiqlangan nishonlar, narx aksentlari |
| **Deep Forest** | `#064e3b` | Sarlavhalar, faol navigatsiya piktogrammalari |
| **Canvas Background** | `#F8FAFC` | Ko'zni charchatmaydigan ultra-yumshoq fon |
| **Surface Card** | `#FFFFFF` | Reys kartochkalari, o'rindiqlar bloki, oqayotgan modallar |
| **Accent Sunset** | `#F43F5E` | Joy tugashi haqida ogohlantirish, bekor qilish shartlari |
| **Border Neutral** | `#E2E8F0` | Yupqa, nafis ajratgich chiziqlar |

### 🚖 B. Haydovchi Rejimi: "Obsidian Cockpit" (Tungi Ko'rish va Yuqori Daromad)
Haydovchi uchun yo'l sharoitiga mos, ko'zga dam beruvchi premium qora va tillarang aksentlar.

| Rang Nomi | Hex Kodi | Qo'llanish O'rni |
|---|---|---|
| **Cockpit Obsidian** | `#090D16` | Asosiy qora fon (OLED ekranlarda batareyani 30% tejaydi) |
| **Card Graphite** | `#111827` | Kartochkalar, yo'lovchilar manifesti bloki |
| **Amber Gold** | `#F59E0B` | Hamyon balansi, tushumlar, yangi reys e'lon qilish tugmasi |
| **Signal Emerald** | `#10B981` | "Safarga tayyorman" onlayn indikatori, muvaffaqiyatli bortga olish |
| **Warning Coral** | `#EF4444` | Reysni bekor qilish, jarima ogohlantirishlari |

---

## 🔤 3. TIPOGRAFIKA VA RAQAMLAR (TYPOGRAPHY)

* **Font oilasi:** `Plus Jakarta Sans` / `SF Pro Display` (iOS) & `Roboto / Inter` (Android).
* **Tabular Numbers (Teng kenglikdagi raqamlar):** Narxlar (`120 000 UZS`), jo'nash soatlari (`08:30`) va 4 xonali bort kodi (`4892`) o'qilishda hech qachon sakramaydi.

### Shriftlar shkalasi:
- **Hero Display:** 28px, Bold (Marshrut nomlari: Toshkent ➔ Samarqand)
- **Title 1:** 22px, SemiBold (Ekran sarlavhalari, Hamyon balansi)
- **Title 2:** 18px, SemiBold (Karta sarlavhalari, O'rindiq narxi)
- **Body Regular:** 15px, Regular (Reys tavsifi, yo'lovchi ismi, chegara qoidalari)
- **Caption / Badge:** 12px, Medium (Avtomobil yili, bo'sh joylar, reyting)
- **Security OTP Code:** 32px, ExtraBold, Monospace (Haydovchiga aytiladigan bort kodi)

---

## 💎 4. OTAXIʼNING 3 TA OʻZIGA XOS SIGNATURE UX INNAVATSIYASI

### 1. 💺 Interaktiv 3D/Top-Down Avtomobil Sxemasi (`SeatMap`)
Klassik ilovalarda shunchaki "1 ta joy", "2 ta joy" degan matn bo'ladi. OTAXI'da esa yo'lovchi xuddi samolyotdagidek **qayerda o'tirishini o'zi tanlaydi**:
- **Rul ramzi:** Haydovchi qayerda o'tirganini aniq ko'rsatadi.
- **1-o'rindiq (Oldi VIP):** Kengroq oyoq joyi, old oyna ko'rinishi.
- **2, 3, 4-o'rindiqlar (Orqa qator):** Deraza yonidagi yoki o'rtadagi joy.
- **Vizual holatlar:**
  * Ochiq yashil hoshiya = Bo'sh joy;
  * To'q zumrad fon = Siz tanlagan joy;
  * Xira kulrang va qulf belgisi = Boshqa yo'lovchi allaqachon band qilgan;
- **10 daqiqalik Countdown Timer:** Joy tanlangach, boshqa odam ololmasligi uchun vaqt hisoblagich chiroyli aylanma progress bar bilan yonadi.

---

### 2. 🛂 Xalqaro Chegara Tayyorgarligi Gidi (`BorderChecklistModal`)
OTAXI'ning Yandex Go yoki inDrive'dan tubdan farq qiluvchi xususiyati:
- Xalqaro reys tanlanganda (masalan: *Toshkent ➔ Shymkent* yoki *Toshkent ➔ Bishkek*) to'lovdan oldin nafis Bottom Sheet ochiladi.
- **Progress Ring:** `3/5 tekshirildi (60%)`.
- **Interaktiv bandlar:**
  1. *Qizil xorijiy pasport:* Kamida 6 oy amal qilish muddati ko'rsatmasi bilan.
  2. *30 kunlik vizasiz rejim:* Qozog'iston / Qirg'iziston qoidalari.
  3. *Bolalar ruxsatnomasi:* Notarial tasdiqlangan hujjat haqida eslatma.
  4. *Naqd pul deklaratsiyasi:* $10 000 chegarasi eslatmasi.
- Yo'lovchi barcha bandlarni tasdiqlagachgina *"Chegara talablari bilan tanishdim"* tugmasi faollashadi. Bu chegarada kutilmagan qaytarilishlarning oldini oladi!

---

### 3. 🎫 Aviachipta Uslubidagi Dinamik Bort Chiptasi (`BoardingPassCard`)
Yo'lovchi safar kuni bekatga chiqqanda chalkashlik bo'lmasligi uchun samolyot chiptasi (Boarding Pass) dizayni:
- Yuqori qism: Shaharlar qisqartmasi (`TAS` ➔ `CIT`), jo'nash vaqti, haydovchi ismi va avtomobil davlat raqami (masalan: `01 A 777 AA`).
- O'rtada: Perfolatsiya qilingan (kesilgan) chipta chizig'i.
- Pastki qism: **Katta 4 xonali Bort Kodi (masalan: `4892`)** va QR kod.
- **Haydovchi bilan sinxronizatsiya:** Haydovchi yo'lovchini mashinaga mindirishda o'z ilovasiga shu 4 xonali kodni kiritadi ➔ tizim "Bortda" deb belgilaydi va soxta bronlarning oldi olinadi.

---

## 🖐️ 5. ERGONOMIKA VA HARAKATLAR (MICRO-INTERACTIONS)

1. **Haptic Feedback (Taktil tebranish):**
   - O'rindiqni tanlaganda: engil chertish (Light tap).
   - Chek-list bandini belgilaganda: tasdiq tebranishi (Selection click).
   - Reys muvaffaqiyatli bron qilinganda: tantanali tebranish (Success vibration).
2. **Bottom Sheet & Gestures:**
   - Ekranni yopish uchun pastga surish (Swipe to dismiss).
   - Reys yaratishda sanani tanlash uchun silliq kalendar varaqasi.
3. **Zaif aloqa indikatori (Corridor Offline Mode):**
   - Agar avtomobil dovon yoki cho'l zonasiga kirib internet yo'qolsa, ekranning tepasida xira sarg'ish lenta chiqadi: *"Oflayn rejim: GPS koordinatalar xotiraga saqlanmoqda"*.

---

## 📱 6. ASOSIY EKRANLARNING SPESIFIKATSIYASI

```
+--------------------------------------------------------+
|  [OTAXI]               [ Yo'lovchi | Haydovchi ] 🔄   |  <- Switch Header
+--------------------------------------------------------+
|                                                        |
|   Qayerdan: [ Toshkent, Olmazor metro            ]     |
|   Qayerga:  [ Shymkent, Mega Planet        🇰🇿  ]     |  <- Xalqaro nishon
|   Sana:     [ Ertaga, 29-oktabr  |  1 yo'lovchi  ]     |
|   [ REYSLARNI QIDIRISH (4 ta bo'sh reys) ]             |
|                                                        |
|  ⭐ Mashhur yo'nalishlar:                              |
|  [ Toshkent ➔ Samarqand ] [ Toshkent ➔ Shymkent 🇰🇿 ]   |
|                                                        |
|  🚘 Top Reys: Farruxbek Aliyev (5.0 ★)                 |
|  Toyota Camry 70 • 07:00 • 250,000 UZS                 |
|  [ Xalqaro Reys: Chegara Gidi Mavjud ]                 |
+--------------------------------------------------------+
|  [🔍 Qidiruv]    [🎫 Safarlarim]    [👤 Profil]        |  <- Bottom Navigation
+--------------------------------------------------------+
```

---

Ushbu dizayn tizimi xalqaro darajadagi eng ilg'or mobility standartlarini o'zida mujassam etgan bo'lib, OTAXI'ni Markaziy Osiyo bozorida birinchi raqamli innovatsion brendga aylantirishga xizmat qiladi.
