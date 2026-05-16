'use client'

import { useState } from 'react'
import { Field, Input, SaveBtn, SectionCard } from '../FormFields'

interface Props {
  showToast: (msg: string, type?: 'success' | 'error') => void
}

export function AdminSecurity({ showToast }: Props) {
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' })
  const [loading, setLoading] = useState(false)

  const set = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }))

  async function handleChange() {
    if (!form.current) { showToast('أدخل كلمة المرور الحالية', 'error'); return }
    if (!form.newPass) { showToast('أدخل كلمة المرور الجديدة', 'error'); return }
    if (form.newPass.length < 6) { showToast('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error'); return }
    if (form.newPass !== form.confirm) { showToast('كلمات المرور غير متطابقة', 'error'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current: form.current, newPassword: form.newPass }),
      })
      const data = await res.json()
      if (res.ok) {
        showToast('تم تغيير كلمة المرور بنجاح ✓')
        setForm({ current: '', newPass: '', confirm: '' })
      } else {
        showToast(data.error || 'فشل تغيير كلمة المرور', 'error')
      }
    } catch {
      showToast('خطأ في الاتصال', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <SectionCard title="تغيير كلمة المرور">
        <Field label="كلمة المرور الحالية">
          <Input
            type="password"
            value={form.current}
            onChange={e => set('current', e.target.value)}
            placeholder="••••••••"
          />
        </Field>
        <Field label="كلمة المرور الجديدة" hint="6 أحرف على الأقل">
          <Input
            type="password"
            value={form.newPass}
            onChange={e => set('newPass', e.target.value)}
            placeholder="••••••••"
          />
        </Field>
        <Field label="تأكيد كلمة المرور الجديدة">
          <Input
            type="password"
            value={form.confirm}
            onChange={e => set('confirm', e.target.value)}
            placeholder="••••••••"
            onKeyDown={e => e.key === 'Enter' && handleChange()}
          />
        </Field>
        <SaveBtn loading={loading} onClick={handleChange} label="تغيير كلمة المرور" />
      </SectionCard>

      <SectionCard title="معلومات الجلسة">
        <div className="space-y-3 font-mono text-sm text-[var(--text-2)]">
          <div className="flex justify-between">
            <span className="text-[var(--text-3)]">مدة الجلسة</span>
            <span className="text-[var(--cyan)]">7 أيام</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-3)]">نوع المصادقة</span>
            <span className="text-[var(--cyan)]">JWT + HttpOnly Cookie</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-3)]">مسار اللوحة</span>
            <span className="text-[var(--cyan)]">/admin</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-3)]">مفهرس بمحركات البحث</span>
            <span className="text-[var(--red)]">لا ✗</span>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="تلميحات الأمان">
        <ul className="space-y-2 font-mono text-xs text-[var(--text-3)]">
          <li className="flex gap-2"><span className="text-[var(--cyan)]">›</span> استخدم كلمة مرور قوية تحتوي على أرقام وحروف ورموز</li>
          <li className="flex gap-2"><span className="text-[var(--cyan)]">›</span> لا تشارك رابط /admin مع أحد</li>
          <li className="flex gap-2"><span className="text-[var(--cyan)]">›</span> اضبط JWT_SECRET في .env.local على قيمة عشوائية طويلة</li>
          <li className="flex gap-2"><span className="text-[var(--cyan)]">›</span> استخدم HTTPS في الإنتاج</li>
        </ul>
      </SectionCard>
    </div>
  )
}
