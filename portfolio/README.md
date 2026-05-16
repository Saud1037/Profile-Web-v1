# 🖥️ Portfolio Dashboard

موقع شخصي بتصميم Dashboard مستقبلي مبني بـ Next.js 14 + Tailwind CSS + Framer Motion + Supabase.

---

## ⚡ التقنيات

| التقنية | الاستخدام |
|---|---|
| **Next.js 14** | App Router + Server Components |
| **Tailwind CSS** | التصميم والـ Responsive |
| **Framer Motion** | الأنيميشن والحركات |
| **Supabase** | قاعدة البيانات + RLS |
| **JWT + bcrypt** | مصادقة لوحة Admin |

---

## 🚀 التشغيل السريع

### 1. تثبيت الحزم
```bash
npm install
```

### 2. إعداد Supabase
1. أنشئ مشروعاً جديداً على [supabase.com](https://supabase.com)
2. اذهب إلى **SQL Editor** وشغّل ملف `supabase-schema.sql` بالكامل
3. من **Project Settings > API** انسخ:
   - `Project URL`
   - `anon public` key
   - `service_role` key

### 3. إعداد المتغيرات
```bash
cp .env.local.example .env.local
```

ثم عدّل `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
JWT_SECRET=your-super-secret-random-string-min-32-chars
ADMIN_PASSWORD=admin123
```

> **لكلمة مرور مشفرة (موصى به في الإنتاج):**
> ```bash
> node -e "const b=require('bcryptjs');console.log(b.hashSync('كلمةمرورك',10))"
> ```
> ثم ضع الناتج في `ADMIN_PASSWORD_HASH` بدلاً من `ADMIN_PASSWORD`

### 4. تشغيل المشروع
```bash
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000)

---

## 📁 هيكل المشروع

```
src/
├── app/
│   ├── page.tsx                  # الصفحة الرئيسية
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # CSS عام
│   ├── admin/
│   │   ├── page.tsx              # لوحة التحكم (محمية)
│   │   └── login/page.tsx        # صفحة الدخول
│   └── api/
│       ├── auth/route.ts         # تسجيل الدخول/الخروج
│       ├── auth/change-password/ # تغيير كلمة المرور
│       ├── profile/route.ts      # بيانات الملف الشخصي
│       ├── projects/route.ts     # المشاريع CRUD
│       ├── skills/route.ts       # المهارات CRUD
│       └── social/route.ts       # روابط التواصل CRUD
├── components/
│   ├── ui/
│   │   └── Navbar.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── SkillsSection.tsx
│   │   └── SocialSection.tsx
│   ├── terminal/
│   │   └── TerminalSection.tsx
│   └── admin/
│       ├── AdminLogin.tsx
│       ├── AdminDashboard.tsx
│       ├── FormFields.tsx
│       └── tabs/
│           ├── AdminGeneral.tsx
│           ├── AdminProjects.tsx
│           ├── AdminSkills.tsx
│           ├── AdminSecurity.tsx
│           └── AdminSocial.tsx
├── lib/
│   ├── supabase.ts
│   ├── auth.ts
│   ├── data.ts
│   ├── utils.ts
│   └── withAuth.ts
└── types/index.ts
```

---

## 🔐 لوحة التحكم

- **الرابط:** `/admin`
- **الدخول:** `/admin/login`
- الصفحة غير مفهرسة بمحركات البحث (`noindex`)
- المصادقة: JWT مخزّن في HttpOnly Cookie (7 أيام)

### ما يمكن تعديله:
- ✅ المعلومات الشخصية (الاسم، الدور، النبذة، Tags، الإحصائيات)
- ✅ إضافة/تعديل/حذف المشاريع (مع رابط الصورة)
- ✅ إضافة/تعديل/حذف المهارات ومجموعاتها
- ✅ إضافة/تعديل/حذف روابط التواصل الاجتماعي
- ✅ تغيير كلمة المرور

---

## 🖥️ Terminal — الأوامر المتاحة

| الأمر | الوظيفة |
|---|---|
| `help` | عرض جميع الأوامر |
| `about` | نبذة شخصية |
| `projects` | قائمة المشاريع |
| `skills` | المهارات مع Progress Bars |
| `contact` | معلومات التواصل |
| `whoami` | الاسم |
| `date` | التاريخ والوقت |
| `uptime` | وقت التشغيل |
| `clear` | مسح الشاشة |
| `echo [text]` | طباعة نص |

---

## 🌍 النشر على Vercel

```bash
# ربط المشروع
vercel

# إضافة المتغيرات
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add JWT_SECRET
vercel env add ADMIN_PASSWORD_HASH

# نشر
vercel --prod
```

---

## 📝 ملاحظات

- البيانات الافتراضية تظهر تلقائياً إذا لم يكن Supabase مضبوطاً
- لا تنشر `SUPABASE_SERVICE_ROLE_KEY` في الكود — هي للـ Server فقط
- `revalidate = 60` يعني أن البيانات تُحدَّث تلقائياً كل دقيقة
