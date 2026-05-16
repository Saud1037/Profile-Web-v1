'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Field, Input, SaveBtn, DeleteBtn } from '../FormFields'
import type { SocialLink } from '@/types'

interface Props {
  socialLinks: SocialLink[]
  showToast: (msg: string, type?: 'success' | 'error') => void
  onSaved: () => void
}

function newLink(): SocialLink {
  return {
    id: Math.random().toString(36).slice(2),
    platform: 'منصة جديدة',
    handle: '@handle',
    url: 'https://',
    icon: '🌐',
    color: '#888888',
    sort_order: 999,
  }
}

export function AdminSocial({ socialLinks: initial, showToast, onSaved }: Props) {
  const [links, setLinks] = useState<SocialLink[]>(initial)
  const [loading, setLoading] = useState<string | null>(null)

  const update = (id: string, key: keyof SocialLink, value: string | number) => {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, [key]: value } : l))
  }

  const add = () => setLinks(prev => [...prev, newLink()])

  const remove = async (id: string) => {
    if (!confirm('هل تريد حذف هذا الرابط؟')) return
    setLoading(id)
    try {
      const res = await fetch('/api/social', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        setLinks(prev => prev.filter(l => l.id !== id))
        showToast('تم الحذف')
        onSaved()
      } else {
        showToast('فشل الحذف', 'error')
      }
    } catch {
      showToast('خطأ في الاتصال', 'error')
    } finally {
      setLoading(null)
    }
  }

  const save = async (link: SocialLink) => {
    setLoading(link.id)
    try {
      const res = await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(link),
      })
      if (res.ok) {
        showToast(`تم حفظ "${link.platform}" ✓`)
        onSaved()
      } else {
        showToast('فشل الحفظ', 'error')
      }
    } catch {
      showToast('خطأ في الاتصال', 'error')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-mono text-xs text-[var(--cyan)] uppercase tracking-widest">
          روابط التواصل ({links.length})
        </h2>
        <button
          onClick={add}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono text-[var(--green)] bg-[var(--green-glow)] border border-[rgba(0,255,136,0.2)] hover:bg-[rgba(0,255,136,0.2)] transition-colors"
        >
          + إضافة رابط
        </button>
      </div>

      <AnimatePresence initial={false}>
        {links.map(link => (
          <motion.div
            key={link.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 mb-3">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{link.icon}</span>
                  <span className="font-mono text-sm text-[var(--text)]">{link.platform}</span>
                </div>
                <DeleteBtn onClick={() => remove(link.id)} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                <Field label="المنصة" className="mb-0">
                  <Input value={link.platform} onChange={e => update(link.id, 'platform', e.target.value)} />
                </Field>
                <Field label="الـ Handle" className="mb-0">
                  <Input value={link.handle} onChange={e => update(link.id, 'handle', e.target.value)} />
                </Field>
                <Field label="الإيموجي" className="mb-0">
                  <Input value={link.icon} onChange={e => update(link.id, 'icon', e.target.value)} className="w-16" />
                </Field>
                <Field label="الترتيب" className="mb-0">
                  <Input
                    type="number"
                    value={link.sort_order}
                    onChange={e => update(link.id, 'sort_order', parseInt(e.target.value) || 0)}
                    className="w-20"
                  />
                </Field>
              </div>

              <Field label="الرابط" className="mb-3">
                <Input
                  value={link.url}
                  onChange={e => update(link.id, 'url', e.target.value)}
                  placeholder="https://..."
                  dir="ltr"
                />
              </Field>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <label className="font-mono text-xs text-[var(--text-3)] uppercase tracking-widest">
                    اللون
                  </label>
                  <input
                    type="color"
                    value={link.color}
                    onChange={e => update(link.id, 'color', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-[var(--border)] bg-transparent"
                  />
                  <span className="font-mono text-xs text-[var(--text-3)]">{link.color}</span>
                </div>
                <SaveBtn
                  loading={loading === link.id}
                  onClick={() => save(link)}
                  label="حفظ"
                  className="text-xs px-4 py-2"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {links.length === 0 && (
        <div className="text-center py-12 text-[var(--text-3)] font-mono text-sm">
          لا توجد روابط — اضغط "+ إضافة رابط"
        </div>
      )}
    </div>
  )
}
