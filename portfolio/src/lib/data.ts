import { supabase, createServiceClient } from './supabase'
import type { Project, SkillGroup, SocialLink, Profile, SiteData } from '@/types'

// ─── PUBLIC READ ─────────────────────────────────────────────────────────────

export async function getProfile(): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .single()
  if (error) {
    console.error('getProfile error:', error)
    return getDefaultProfile()
  }
  return data
}

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) {
    console.error('getProjects error:', error)
    return getDefaultProjects()
  }
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
    skills: (skills || []).filter(s => s.group_id === g.id),
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

// ─── ADMIN WRITE (uses service client) ───────────────────────────────────────

export async function updateProfile(data: Partial<Profile>): Promise<void> {
  const client = createServiceClient()
  const { error } = await client
    .from('profile')
    .upsert({ id: '1', ...data })
  if (error) throw error
}

export async function upsertProject(project: Partial<Project> & { id?: string }): Promise<Project> {
  const client = createServiceClient()
  const { data, error } = await client
    .from('projects')
    .upsert(project)
    .select()
    .single()
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

// ─── DEFAULTS (fallback when DB not set up yet) ───────────────────────────────

function getDefaultProfile(): Profile {
  return {
    id: '1',
    name: 'سعود',
    role: 'مطور • مبتكر',
    bio: 'مطور متخصص في بناء تجارب رقمية استثنائية. أجمع بين الكود النظيف والتصميم الجذاب لبناء منتجات تترك أثراً.',
    tags: ['JavaScript', 'Node.js', 'Discord.js', 'Supabase', 'React', 'UI/UX'],
    stats: [
      { key: '3+', value: 'سنوات خبرة' },
      { key: '20+', value: 'مشروع مكتمل' },
      { key: '10k+', value: 'سطر كود' },
      { key: '∞', value: 'شغف ودوافع' },
    ],
    available_for_work: true,
  }
}

function getDefaultProjects(): Project[] {
  return [
    {
      id: '1',
      name: 'Discord Giveaway Bot',
      description: 'بوت سحب احترافي بنظام نقاط الحظ، لوحة المتصدرين، وأوامر Slash متكاملة مع Supabase.',
      tags: ['Node.js', 'Discord.js', 'Supabase'],
      link: '#',
      emoji: '🎉',
      active: true,
      sort_order: 1,
    },
    {
      id: '2',
      name: 'Admin Manager Bot',
      description: 'بوت إدارة متعدد المستويات مع صلاحيات Owner وAdmin ونظام مرونة في إضافة الأدوار.',
      tags: ['Node.js', 'Discord.js', 'JSON'],
      link: '#',
      emoji: '🛡️',
      active: true,
      sort_order: 2,
    },
    {
      id: '3',
      name: 'Portfolio Dashboard',
      description: 'موقع شخصي بتصميم Dashboard مستقبلي مع Terminal تفاعلي ولوحة تحكم Admin.',
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
      group_name: 'الواجهة الأمامية',
      sort_order: 1,
      skills: [
        { id: 's1', group_id: 'g1', name: 'React / Next.js', percentage: 80, sort_order: 1 },
        { id: 's2', group_id: 'g1', name: 'Tailwind CSS', percentage: 85, sort_order: 2 },
        { id: 's3', group_id: 'g1', name: 'JavaScript', percentage: 90, sort_order: 3 },
      ],
    },
    {
      id: 'g2',
      group_name: 'الخلفية والـ API',
      sort_order: 2,
      skills: [
        { id: 's4', group_id: 'g2', name: 'Node.js', percentage: 90, sort_order: 1 },
        { id: 's5', group_id: 'g2', name: 'Supabase', percentage: 85, sort_order: 2 },
        { id: 's6', group_id: 'g2', name: 'REST APIs', percentage: 80, sort_order: 3 },
      ],
    },
    {
      id: 'g3',
      group_name: 'الأدوات والـ DevOps',
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

// Re-export type so it can be used without importing from types directly
import type { Skill } from '@/types'
export type { Skill }
