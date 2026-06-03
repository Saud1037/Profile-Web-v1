import { ProfileData } from "@/types";

export const DEFAULT_PROFILE: ProfileData = {
  name: "username",
  bio: "",
  avatar: "",
  banner: "",
  siteName: "Profile",
  favicon: "",
  adminPassword: "admin123",
  colors: {
    primary:       "#6366f1",
    background:    "#0a0a0f",
    gradientFrom:  "#6366f1",
    gradientTo:    "#a855f7",
    gradientAngle: 135,
    cardGlass:     "rgba(255,255,255,0.04)",
    text:          "#ffffff",
  },
  links: [],
  projects: [],
};

export const STORAGE_KEY = "profile_data";

export const AVAILABLE_ICONS = [
  "Github","Twitter","Instagram","Youtube","Twitch","Linkedin",
  "Globe","Mail","MessageCircle","Phone","Link","Code",
  "Play","Star","Heart","Zap","Coffee","Music",
  "Camera","Gamepad2","BookOpen","Briefcase","Download","ExternalLink",
  "Bot","Rocket","Package","Cpu","Terminal","Database",
  "Shield","Lock","Key","Cloud","Server","Wifi",
  "Palette","Brush","Layout","Monitor","Smartphone","Tablet",
];
