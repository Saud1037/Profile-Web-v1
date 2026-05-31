export interface SocialLink {
  id: string;
  title: string;
  url: string;
  icon: string;        // اسم Lucide أو "custom:base64..."
  order: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;       // base64 أو URL
  url: string;         // رابط المشروع (اختياري)
  tags: string[];      // مثل ["Discord Bot", "Node.js"]
  icon: string;        // اسم Lucide أو "custom:base64..."
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
  colors: ProfileColors;
  links: SocialLink[];
  projects: Project[];
  adminPassword: string;
}
