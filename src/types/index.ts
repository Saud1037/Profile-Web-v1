export interface SocialLink {
  id: string;
  title: string;
  url: string;
  icon: string;
  order: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  url: string;
  tags: string[];
  icon: string;
  order: number;
}

export interface ProfileColors {
  primary: string;
  background: string;
  gradientFrom: string;
  gradientTo: string;
  gradientAngle: number;
  cardGlass: string;
  text: string;
}

export interface ProfileData {
  name: string;
  bio: string;
  avatar: string;
  banner: string;
  siteName: string;   // اسم التبويب في المتصفح
  favicon: string;    // base64 للأيقونة (اختياري)
  colors: ProfileColors;
  links: SocialLink[];
  projects: Project[];
  adminPassword: string;
}
