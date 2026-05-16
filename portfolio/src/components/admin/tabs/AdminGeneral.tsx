'use client'

import { useState } from 'react'
import { Field, Input, Textarea, SaveBtn, SectionCard } from '../FormFields'
import type { Profile } from '@/types'

interface Props {
  profile: Profile
  showToast: (msg: string, type?: 'success' | 'error') => void
  onSaved: () => void
}

export function AdminGeneral({ profile, showToast, onSaved }: Props) {
  const [form, setForm] = useState({
    name: profile.name,
    username: profile.username || '',
    role: profile.role,
    bio: profile.bio,
    tags: profile.tags.join(', '),
    stats: profile.stats.map(s => `${s.key}:${s.value}`).join(', '),
    available_for_work: profile.available_for_work,
    avatar_url: profile.avatar_url || '',
    banner_url: profile.banner_url || '',
    banner_color: profile.banner_color || '#0d1f3c',
  })
  const [loading, setLoading] = useState(false)

  const set = (key: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [key]: value }))

  async function handleSave() {
    setLoading(true)
    try {
      const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean)
      const stats = form.stats.split(',').map(s => {
        const idx = s.indexOf(':')
        if (idx === -1) return null
        return { key: s.slice(0, idx).trim(), value: s.slice(idx + 1).trim() }
      }).filter(Boolean)

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tags, stats }),
      })
      if (res.ok) {
        showToast('Profile saved ✓')
        onSaved()
      } else {
        const d = await res.json()
        showToast(d.error || 'Save failed', 'error')
      }
    } catch {
      showToast('Connection error', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Avatar & Banner */}
      <SectionCard title="Profile Images">
        {/* Live preview */}
        <div className="mb-6 rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--bg-secondary)] w-full max-w-xs">
          {/* Banner preview */}
          <div
            className="w-full h-20 relative"
            style={{
              background: form.banner_url
                ? `url(${form.banner_url}) center/cover`
                : form.banner_color || '#0d1f3c',
            }}
          />
          {/* Avatar preview */}
          <div className="px-4 pb-4">
            <div className="relative -mt-8 mb-2 inline-block">
              <div className="w-16 h-16 rounded-full border-4 border-[var(--bg-secondary)] overflow-hidden bg-[var(--surface)]">
                {form.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.avatar_url} alt="avatar preview" className="w-full h-full object-cover" />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-2xl font-bold"
                    style={{ background: 'linear-gradient(135deg, var(--cyan), var(--purple))' }}
                  >
                    {form.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <div className="font-mono text-xs text-[var(--text-3)]">Live preview</div>
          </div>
        </div>

        <Field label="Avatar URL" hint="Direct image link (imgur, Discord CDN, etc.)">
          <Input
            value={form.avatar_url}
            onChange={e => set('avatar_url', e.target.value)}
            placeholder="https://i.imgur.com/your-avatar.png"
          />
        </Field>
        <Field label="Banner URL" hint="Leave empty to use banner color instead">
          <Input
            value={form.banner_url}
            onChange={e => set('banner_url', e.target.value)}
            placeholder="https://i.imgur.com/your-banner.png"
          />
        </Field>
        <Field label="Banner Color" hint="Used when no banner image is set">
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={form.banner_color}
              onChange={e => set('banner_color', e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer border border-[var(--border)] bg-transparent"
            />
            <Input
              value={form.banner_color}
              onChange={e => set('banner_color', e.target.value)}
              className="w-36"
              placeholder="#0d1f3c"
            />
          </div>
        </Field>
      </SectionCard>

      {/* Personal info */}
      <SectionCard title="Personal Info">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Display Name">
            <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Saud" />
          </Field>
          <Field label="Username" hint="Shown as @username">
            <div className="flex items-center">
              <span className="font-mono text-sm text-[var(--text-3)] px-3 py-2.5 bg-[var(--bg-tertiary)] border border-r-0 border-[var(--border)] rounded-l-lg">@</span>
              <Input
                value={form.username}
                onChange={e => set('username', e.target.value)}
                placeholder="saud.dev"
                className="rounded-l-none"
              />
            </div>
          </Field>
        </div>
        <Field label="Role / Title">
          <Input value={form.role} onChange={e => set('role', e.target.value)} placeholder="Developer • Innovator" />
        </Field>
        <Field label="Bio">
          <Textarea
            value={form.bio}
            onChange={e => set('bio', e.target.value)}
            placeholder="A short bio about yourself..."
            rows={3}
          />
        </Field>
        <Field label="Available for Work">
          <div className="flex items-center gap-3">
            <button
              onClick={() => set('available_for_work', !form.available_for_work)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.available_for_work ? 'bg-[var(--green)]' : 'bg-[var(--border-2)]'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.available_for_work ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className="font-mono text-xs text-[var(--text-3)]">
              {form.available_for_work ? '🟢 Shown as online / open to work' : '⚪ Hidden'}
            </span>
          </div>
        </Field>
      </SectionCard>

      {/* Tags & Stats */}
      <SectionCard title="Tags & Stats">
        <Field label="Tags" hint="Comma-separated — e.g. JavaScript, Node.js, React">
          <Input
            value={form.tags}
            onChange={e => set('tags', e.target.value)}
            placeholder="JavaScript, Node.js, React"
          />
        </Field>
        <Field label="Stats" hint="Format: value:label — e.g. 3+:Years Exp., 20+:Projects">
          <Input
            value={form.stats}
            onChange={e => set('stats', e.target.value)}
            placeholder="3+:Years Exp., 20+:Projects, 10k+:Lines of Code"
          />
        </Field>
      </SectionCard>

      <SaveBtn loading={loading} onClick={handleSave} label="Save Changes" />
    </div>
  )
}
