export interface Project {
  id: string
  name: string
  description: string
  tags: string[]
  link: string
  image_url?: string
  emoji: string
  active: boolean
  sort_order: number
  created_at?: string
}

export interface SkillGroup {
  id: string
  group_name: string
  sort_order: number
  skills: Skill[]
}

export interface Skill {
  id: string
  group_id: string
  name: string
  percentage: number
  sort_order: number
}

export interface SocialLink {
  id: string
  platform: string
  handle: string
  url: string
  icon: string
  color: string
  sort_order: number
}

export interface Profile {
  id: string
  name: string
  username: string
  role: string
  bio: string
  tags: string[]
  stats: StatItem[]
  available_for_work: boolean
  avatar_url?: string
  banner_url?: string
  banner_color?: string
}

export interface StatItem {
  key: string
  value: string
}

export interface SiteData {
  profile: Profile
  projects: Project[]
  skillGroups: SkillGroup[]
  socialLinks: SocialLink[]
}

export interface ThemeColors {
  cyan: string
  purple: string
  green: string
  bgPrimary: string
  bgSecondary: string
  surface: string
  border: string
  text: string
  textMuted: string
}

export interface SiteConfig {
  profile: Profile
  projects: Project[]
  skillGroups: SkillGroup[]
  socialLinks: SocialLink[]
  theme: ThemeColors
}
