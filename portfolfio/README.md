# Profile Site — Next.js + Tailwind

موقع بروفايل شخصي مع لوحة تحكم كاملة.

## التثبيت والتشغيل

```bash
# 1. ادخل للمجلد
cd profile-site

# 2. ثبّت الاعتماديات
npm install

# 3. شغّل بيئة التطوير
npm run dev
```

افتح المتصفح على `http://localhost:3000`

## الصفحات

| الصفحة | الرابط | الوصف |
|--------|--------|-------|
| البروفايل العام | `/` | الصفحة العامة |
| لوحة التحكم | `/admin` | محمية بكلمة مرور |

**كلمة المرور الافتراضية:** `admin123`  
(يمكن تغييرها من لوحة التحكم، وتُحفظ في `localStorage`)

## هيكل الملفات

```
src/
├── app/
│   ├── layout.tsx          # Root layout + ProfileProvider
│   ├── page.tsx            # صفحة البروفايل العامة
│   ├── globals.css         # متغيرات CSS + glassmorphism
│   └── admin/
│       └── page.tsx        # لوحة التحكم
├── components/
│   ├── profile/
│   │   └── LinkCard.tsx    # بطاقة الرابط بتأثير الزجاج
│   └── admin/
│       ├── ImageUploader.tsx
│       ├── ColorPicker.tsx
│       └── LinksManager.tsx
├── context/
│   └── ProfileContext.tsx  # Global state + localStorage sync
├── lib/
│   └── constants.ts        # القيم الافتراضية + الأيقونات
└── types/
    └── index.ts            # TypeScript interfaces
```

## نظام الحفظ

كل التغييرات تُحفظ فوراً في `localStorage` تحت المفتاح `profile_data`.  
لا يوجد قاعدة بيانات — البيانات تبقى على المتصفح.

### للنقل إلى قاعدة بيانات مستقبلاً

استبدل الدوال في `ProfileContext.tsx`:
- `localStorage.getItem(STORAGE_KEY)` → `fetch('/api/profile')`
- `localStorage.setItem(STORAGE_KEY, ...)` → `fetch('/api/profile', { method: 'PUT', ... })`

## الميزات

- 🎨 تغيير الألوان الديناميكي (لون أساسي + خلفية + نص)
- 🖼️ رفع صور بـ Base64 (أفاتار + غلاف)
- 🔗 إدارة روابط (إضافة / تعديل / حذف / ترتيب)
- 💎 تأثير Glassmorphism على البطاقات
- 📱 متجاوب مع جميع الشاشات
- 🔒 لوحة تحكم محمية بكلمة مرور

## النشر على Vercel

```bash
npm install -g vercel
vercel
```
