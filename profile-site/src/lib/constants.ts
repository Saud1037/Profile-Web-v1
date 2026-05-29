import { ProfileData } from "@/types";

export const DEFAULT_PROFILE: ProfileData = {
  name: "سعود الحربي",
  bio: "مطور تطبيقات | بناء أدوات تجعل الحياة أسهل",
  avatar: "",
  banner: "",
  adminPassword: "admin123",
  colors: {
    primary: "#6366f1",
    background: "#0f0f1a",
    cardGlass: "rgba(255,255,255,0.05)",
    text: "#ffffff",
  },
  links: [
    {
      id: "1",
      title: "GitHub",
      url: "https://github.com",
      icon: "Github",
      order: 0,
    },
    {
      id: "2",
      title: "Twitter / X",
      url: "https://twitter.com",
      icon: "Twitter",
      order: 1,
    },
    {
      id: "3",
      title: "Discord",
      url: "https://discord.com",
      icon: "MessageCircle",
      order: 2,
    },
    {
      id: "4",
      title: "تواصل معي",
      url: "mailto:me@example.com",
      icon: "Mail",
      order: 3,
    },
  ],
};

export const STORAGE_KEY = "profile_data";

export const AVAILABLE_ICONS = [
  "Github",
  "Twitter",
  "Instagram",
  "Youtube",
  "Twitch",
  "Linkedin",
  "Globe",
  "Mail",
  "MessageCircle",
  "Phone",
  "Link",
  "Code",
  "Play",
  "Star",
  "Heart",
  "Zap",
  "Coffee",
  "Music",
  "Camera",
  "Gamepad2",
  "BookOpen",
  "Briefcase",
  "Download",
  "ExternalLink",
];
