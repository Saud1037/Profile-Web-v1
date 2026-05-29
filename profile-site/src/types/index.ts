export interface SocialLink {
  id: string;
  title: string;
  url: string;
  icon: string;
  order: number;
}

export interface ProfileColors {
  primary: string;        // لون أيقونات البطاقات والتفاصيل
  background: string;     // لون خلفية الصفحة
  gradientFrom: string;   // لون بداية الـ gradient (زاوية علوية يسار)
  gradientTo: string;     // لون نهاية الـ gradient (زاوية سفلية يمين)
  gradientAngle: number;  // زاوية الـ gradient بالدرجات (0-360)
  cardGlass: string;      // شفافية البطاقات
  text: string;
}

export interface ProfileData {
  name: string;
  bio: string;
  avatar: string;
  banner: string;
  colors: ProfileColors;
  links: SocialLink[];
  adminPassword: string;
}
