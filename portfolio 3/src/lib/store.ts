/**
 * Simple file-based store — works without Supabase.
 * Data lives in /data/site.json (created automatically).
 * On Vercel, falls back to in-memory (resets on redeploy) — use Supabase for persistence.
 */

import fs from 'fs'
import path from 'path'
import type { Profile, Project, SkillGroup, SocialLink, ThemeColors, SiteData } from '@/types'

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'site.json')

export const DEFAULT_THEME: ThemeColors = {
  cyan: '#00d4ff',
  purple: '#a855f7',
  green: '#00ff88',
  bgPrimary: '#080c14',
  bgSecondary: '#0d1117',
  surface: '#0f1923',
  border: '#1e3a4a',
  text: '#e2e8f0',
  textMuted: '#64748b',
}

const DEFAULT_DATA = {
  profile: {
    id: '1',
    name: 'Saud',
    username: 'saud.dev',
    role: 'Developer • Innovator',
    bio: 'A developer specialized in building exceptional digital experiences. I combine clean code with compelling design to ship products that leave an impact.',
    tags: ['JavaScript', 'Node.js', 'Discord.js', 'Supabase', 'React', 'UI/UX'],
    stats: [
      { key: '3+', value: 'Years Exp.' },
      { key: '20+', value: 'Projects' },
      { key: '10k+', value: 'Lines of Code' },
      { key: '∞', value: 'Passion' },
    ],
    available_for_work: true,
    avatar_url: '',
    banner_url: '',
    banner_color: '#0d1f3c',
  } as Profile,
  projects: [
    { id: 'p1', name: 'Discord Giveaway Bot', description: 'A professional giveaway bot with weighted luck multipliers, leaderboards, and full Slash command support backed by Supabase.', tags: ['Node.js', 'Discord.js', 'Supabase'], link: '#', emoji: '🎉', active: true, sort_order: 1 },
    { id: 'p2', name: 'Admin Manager Bot', description: 'A multi-tier Discord admin management bot with Owner/Admin roles and flexible role assignment.', tags: ['Node.js', 'Discord.js', 'JSON'], link: '#', emoji: '🛡️', active: true, sort_order: 2 },
    { id: 'p3', name: 'Portfolio Dashboard', description: 'A futuristic personal dashboard with an interactive terminal and hidden Admin panel.', tags: ['Next.js', 'Tailwind', 'Supabase'], link: '#', emoji: '🖥️', active: false, sort_order: 3 },
  ] as Project[],
  skillGroups: [
    { id: 'g1', group_name: 'Frontend', sort_order: 1, skills: [
      { id: 's1', group_id: 'g1', name: 'React / Next.js', percentage: 80, sort_order: 1 },
      { id: 's2', group_id: 'g1', name: 'Tailwind CSS', percentage: 85, sort_order: 2 },
      { id: 's3', group_id: 'g1', name: 'JavaScript', percentage: 90, sort_order: 3 },
    ]},
    { id: 'g2', group_name: 'Backend & APIs', sort_order: 2, skills: [
      { id: 's4', group_id: 'g2', name: 'Node.js', percentage: 90, sort_order: 1 },
      { id: 's5', group_id: 'g2', name: 'Supabase', percentage: 85, sort_order: 2 },
      { id: 's6', group_id: 'g2', name: 'REST APIs', percentage: 80, sort_order: 3 },
    ]},
    { id: 'g3', group_name: 'DevOps & Tools', sort_order: 3, skills: [
      { id: 's7', group_id: 'g3', name: 'Git & GitHub', percentage: 85, sort_order: 1 },
      { id: 's8', group_id: 'g3', name: 'PM2 / Linux', percentage: 75, sort_order: 2 },
      { id: 's9', group_id: 'g3', name: 'Discord.js', percentage: 95, sort_order: 3 },
    ]},
  ] as SkillGroup[],
  socialLinks: [
    { id: 'sl1', platform: 'GitHub', handle: '@saud-dev', url: 'https://github.com', icon: '💻', color: '#333333', sort_order: 1 },
    { id: 'sl2', platform: 'Twitter / X', handle: '@saud_dev', url: 'https://twitter.com', icon: '🐦', color: '#1da1f2', sort_order: 2 },
    { id: 'sl3', platform: 'LinkedIn', handle: 'Saud', url: 'https://linkedin.com', icon: '💼', color: '#0077b5', sort_order: 3 },
    { id: 'sl4', platform: 'Discord', handle: 'saud#0000', url: '#', icon: '🎮', color: '#5865f2', sort_order: 4 },
  ] as SocialLink[],
  theme: DEFAULT_THEME,
}

// In-memory cache (used when file system isn't writable e.g. Vercel)
let memoryStore: typeof DEFAULT_DATA | null = null

function canWriteFS(): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
    return true
  } catch {
    return false
  }
}

export function readStore(): typeof DEFAULT_DATA {
  // Try file system first
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8')
      const parsed = JSON.parse(raw)
      // Merge with defaults to ensure new fields exist
      return {
        ...DEFAULT_DATA,
        ...parsed,
        profile: { ...DEFAULT_DATA.profile, ...parsed.profile },
        theme: { ...DEFAULT_THEME, ...parsed.theme },
      }
    }
  } catch { /* fall through */ }

  // Try memory
  if (memoryStore) return memoryStore

  return { ...DEFAULT_DATA }
}

export function writeStore(data: Partial<typeof DEFAULT_DATA>): void {
  const current = readStore()
  const updated = { ...current, ...data }

  // Try file system
  if (canWriteFS()) {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2), 'utf-8')
      return
    } catch { /* fall through to memory */ }
  }

  // Fallback: memory store
  memoryStore = updated
}

// Helpers
export function getStoreProfile(): Profile { return readStore().profile }
export function getStoreProjects(): Project[] { return readStore().projects.sort((a, b) => a.sort_order - b.sort_order) }
export function getStoreSkillGroups(): SkillGroup[] { return readStore().skillGroups.sort((a, b) => a.sort_order - b.sort_order) }
export function getStoreSocialLinks(): SocialLink[] { return readStore().socialLinks.sort((a, b) => a.sort_order - b.sort_order) }
export function getStoreTheme(): ThemeColors { return readStore().theme }

export function getAllData(): SiteData & { theme: ThemeColors } {
  const store = readStore()
  return {
    profile: store.profile,
    projects: store.projects.sort((a, b) => a.sort_order - b.sort_order),
    skillGroups: store.skillGroups.sort((a, b) => a.sort_order - b.sort_order),
    socialLinks: store.socialLinks.sort((a, b) => a.sort_order - b.sort_order),
    theme: store.theme,
  }
}
