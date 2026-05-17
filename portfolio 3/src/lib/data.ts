import { supabase, createServiceClient } from './supabase'
import type { Project, SkillGroup, SocialLink, Profile, SiteData, Skill } from '@/types'

// ─── PUBLIC READ ─────────────────────────────────────────────────────────────

export async function getProfile(): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .single()
  if (error) return getDefaultProfile()
  return data
}

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) return getDefaultProjects()
  return data || []
}

export async function getSkillGroups(): Promise<SkillGroup[]> {
  const { data: groups, error: gErr } = await supabase
    .from('skill_groups')
    .select('*')
    .order('sort_order', { ascending: true })
  if (gErr) return getDefaultSkillGroups()

  const { data: skills, error: sErr } = await supabase
    .from('skills')
    .select('*')
    .order('sort_order', { ascending: true })
  if (sErr) return getDefaultSkillGroups()

  return (groups || []).map(g => ({
    ...g,
    skills: (skills || []).filter((s: Skill) => s.group_id === g.id),
  }))
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) return getDefaultSocialLinks()
  return data || []
}

export async function getAllSiteData(): Promise<SiteData> {
  const [profile, projects, skillGroups, socialLinks] = await Promise.all([
    getProfile(),
    getProjects(),
    getSkillGroups(),
    getSocialLinks(),
  ])
  return {
    profile: profile || getDefaultProfile(),
    projects,
    skillGroups,
    socialLinks,
  }
}

// ─── ADMIN WRITE ──────────────────────────────────────────────────────────────

export async function updateProfile(data: Partial<Profile>): Promise<void> {
  const client = createServiceClient()
  const { error } = await client.from('profile').upsert({ id: '1', ...data })
  if (error) throw error
}

export async function upsertProject(project: Partial<Project> & { id?: string }): Promise<Project> {
  const client = createServiceClient()
  const { data, error } = await client.from('projects').upsert(project).select().single()
  if (error) throw error
  return data
}

export async function deleteProject(id: string): Promise<void> {
  const client = createServiceClient()
  const { error } = await client.from('projects').delete().eq('id', id)
  if (error) throw error
}

export async function upsertSkillGroup(group: Partial<SkillGroup>): Promise<SkillGroup> {
  const client = createServiceClient()
  const { data, error } = await client
    .from('skill_groups')
    .upsert({ id: group.id, group_name: group.group_name, sort_order: group.sort_order })
    .select()
    .single()
  if (error) throw error
  return { ...data, skills: [] }
}

export async function upsertSkill(skill: Partial<Skill> & { group_id: string }): Promise<void> {
  const client = createServiceClient()
  const { error } = await client.from('skills').upsert(skill)
  if (error) throw error
}

export async function deleteSkill(id: string): Promise<void> {
  const client = createServiceClient()
  const { error } = await client.from('skills').delete().eq('id', id)
  if (error) throw error
}

export async function upsertSocialLink(link: Partial<SocialLink>): Promise<void> {
  const client = createServiceClient()
  const { error } = await client.from('social_links').upsert(link)
  if (error) throw error
}

export async function deleteSocialLink(id: string): Promise<void> {
  const client = createServiceClient()
  const { error } = await client.from('social_links').delete().eq('id', id)
  if (error) throw error
}

// ─── DEFAULTS ────────────────────────────────────────────────────────────────

function getDefaultProfile(): Profile {
  return {
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
  }
}

function getDefaultProjects(): Project[] {
  return [
    {
      id: '1',
      name: 'Discord Giveaway Bot',
      description: 'A professional giveaway bot with weighted luck multipliers, leaderboards, and full Slash command support backed by Supabase.',
      tags: ['Node.js', 'Discord.js', 'Supabase'],
      link: '#',
      emoji: '🎉',
      active: true,
      sort_order: 1,
    },
    {
      id: '2',
      name: 'Admin Manager Bot',
      description: 'A multi-tier Discord admin management bot with Owner/Admin roles, flexible role assignment, and persistent JSON storage.',
      tags: ['Node.js', 'Discord.js', 'JSON'],
      link: '#',
      emoji: '🛡️',
      active: true,
      sort_order: 2,
    },
    {
      id: '3',
      name: 'Portfolio Dashboard',
      description: 'A futuristic personal dashboard site with an interactive terminal and a hidden Admin panel for live content editing.',
      tags: ['Next.js', 'Tailwind', 'Supabase'],
      link: '#',
      emoji: '🖥️',
      active: false,
      sort_order: 3,
    },
  ]
}

function getDefaultSkillGroups(): SkillGroup[] {
  return [
    {
      id: 'g1',
      group_name: 'Frontend',
      sort_order: 1,
      skills: [
        { id: 's1', group_id: 'g1', name: 'React / Next.js', percentage: 80, sort_order: 1 },
        { id: 's2', group_id: 'g1', name: 'Tailwind CSS', percentage: 85, sort_order: 2 },
        { id: 's3', group_id: 'g1', name: 'JavaScript', percentage: 90, sort_order: 3 },
      ],
    },
    {
      id: 'g2',
      group_name: 'Backend & APIs',
      sort_order: 2,
      skills: [
        { id: 's4', group_id: 'g2', name: 'Node.js', percentage: 90, sort_order: 1 },
        { id: 's5', group_id: 'g2', name: 'Supabase', percentage: 85, sort_order: 2 },
        { id: 's6', group_id: 'g2', name: 'REST APIs', percentage: 80, sort_order: 3 },
      ],
    },
    {
      id: 'g3',
      group_name: 'DevOps & Tools',
      sort_order: 3,
      skills: [
        { id: 's7', group_id: 'g3', name: 'Git & GitHub', percentage: 85, sort_order: 1 },
        { id: 's8', group_id: 'g3', name: 'PM2 / Linux', percentage: 75, sort_order: 2 },
        { id: 's9', group_id: 'g3', name: 'Discord.js', percentage: 95, sort_order: 3 },
      ],
    },
  ]
}

function getDefaultSocialLinks(): SocialLink[] {
  return [
    { id: 'sl1', platform: 'GitHub', handle: '@saud-dev', url: 'https://github.com', icon: '💻', color: '#333', sort_order: 1 },
    { id: 'sl2', platform: 'Twitter / X', handle: '@saud_dev', url: 'https://twitter.com', icon: '🐦', color: '#1da1f2', sort_order: 2 },
    { id: 'sl3', platform: 'LinkedIn', handle: 'Saud', url: 'https://linkedin.com', icon: '💼', color: '#0077b5', sort_order: 3 },
    { id: 'sl4', platform: 'Discord', handle: 'saud#0000', url: '#', icon: '🎮', color: '#5865f2', sort_order: 4 },
  ]
}

export type { Skill }
