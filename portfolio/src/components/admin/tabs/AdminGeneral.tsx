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
    role: profile.role,
    bio: profile.bio,
    tags: profile.tags.join(', '),
    stats: profile.stats.map(s => `${s.key}:${s.value}`).join(', '),
    available_for_work: profile.available_for_work,
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
        return { key: s.slice(0, idx).trim(), value: s.slice(idx + 1).trim() }
      }).filter(s => s.key)

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tags, stats }),
      })
      if (res.ok) {
        showToast('تم حفظ المعلومات العامة ✓')
        onSaved()
      } else {
        const d = await res.json()
        showToast(d.error || 'فشل الحفظ', 'error')
      }
    } catch {
      showToast('خطأ في الاتصال', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <SectionCard title="المعلومات الشخصية">
        <Field label="الاسم">
          <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="الاسم الكامل" />
        </Field>
        <Field label="اللقب / الدور">
          <Input value={form.role} onChange={e => set('role', e.target.value)} placeholder="مطور • مبتكر" />
        </Field>
        <Field label="النبذة الشخصية">
          <Textarea
            value={form.bio}
            onChange={e => set('bio', e.target.value)}
            placeholder="نبذة قصيرة عنك..."
            rows={3}
          />
        </Field>
        <Field label="متاح للعمل الحر">
          <button
            onClick={() => set('available_for_work', !form.available_for_work)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              form.available_for_work ? 'bg-[var(--green)]' : 'bg-[var(--border-2)]'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                form.available_for_work ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="font-mono text-xs text-[var(--text-3)] mr-3">
            {form.available_for_work ? 'مفعّل' : 'غير مفعّل'}
          </span>
        </Field>
      </SectionCard>

      <SectionCard title="Tags والإحصائيات">
        <Field label="Tags" hint="مفصولة بفاصلة — مثال: JavaScript, Node.js, React">
          <Input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="JavaScript, Node.js, React" />
        </Field>
        <Field label="الإحصائيات" hint="بصيغة: قيمة:وصف — مثال: 3+:سنوات خبرة, 20+:مشروع">
          <Input value={form.stats} onChange={e => set('stats', e.target.value)} placeholder="3+:سنوات خبرة, 20+:مشروع" />
        </Field>
      </SectionCard>

      <SaveBtn loading={loading} onClick={handleSave} />
    </div>
  )
}
