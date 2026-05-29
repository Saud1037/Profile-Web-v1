export interface SocialLink {
  id: string;
  title: string;
  url: string;
  icon: string; // lucide icon name
  order: number;
}

export interface ProfileColors {
  primary: string;       // e.g. "#6366f1"
  background: string;    // e.g. "#0f0f1a"
  cardGlass: string;     // rgba for glassmorphism
  text: string;
}

export interface ProfileData {
  name: string;
  bio: string;
  avatar: string;        // base64 or URL
  banner: string;        // base64 or URL
  colors: ProfileColors;
  links: SocialLink[];
  adminPassword: string;
}
