'use client'

import { useState } from 'react'
import { Field, Input, SaveBtn, SectionCard } from '../FormFields'

export function AdminSecurity({ showToast }: { showToast: (msg: string, type?: 'success' | 'error') => void }) {
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' })
  const [loading, setLoading] = useState(false)

  const set = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }))

  async function handleChange() {
    if (!form.current) { showToast('Enter current password', 'error'); return }
    if (!form.newPass || form.newPass.length < 6) { showToast('New password must be at least 6 characters', 'error'); return }
    if (form.newPass !== form.confirm) { showToast('Passwords do not match', 'error'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current: form.current, newPassword: form.newPass }),
      })
      const data = await res.json()
      if (res.ok) { showToast('Password changed ✓'); setForm({ current: '', newPass: '', confirm: '' }) }
      else showToast(data.error || 'Failed to change password', 'error')
    } catch { showToast('Connection error', 'error') }
    finally { setLoading(false) }
  }

  return (
    <div>
      <SectionCard title="Change Password">
        <Field label="Current Password">
          <Input type="password" value={form.current} onChange={e => set('current', e.target.value)} placeholder="••••••••" />
        </Field>
        <Field label="New Password" hint="Minimum 6 characters">
          <Input type="password" value={form.newPass} onChange={e => set('newPass', e.target.value)} placeholder="••••••••" />
        </Field>
        <Field label="Confirm New Password">
          <Input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && handleChange()} />
        </Field>
        <SaveBtn loading={loading} onClick={handleChange} label="Change Password" />
      </SectionCard>

      <SectionCard title="Session Info">
        <div className="space-y-3 font-mono text-sm text-[var(--text-2)]">
          {[
            ['Session Duration', '7 days'],
            ['Auth Method', 'JWT + HttpOnly Cookie'],
            ['Admin Path', '/admin'],
            ['Terminal Command', 'admin'],
            ['Indexed by Search Engines', '✗ No'],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between">
              <span className="text-[var(--text-3)]">{label}</span>
              <span className={val.startsWith('✗') ? 'text-[var(--red)]' : 'text-[var(--cyan)]'}>{val}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Security Tips">
        <ul className="space-y-2 font-mono text-xs text-[var(--text-3)]">
          {[
            'Use a strong password with numbers, letters, and symbols',
            'Do not share the /admin path with anyone',
            'Set JWT_SECRET in .env.local to a long random string',
            'Always use HTTPS in production',
            'Type "admin" in the terminal to access the panel',
          ].map((tip, i) => (
            <li key={i} className="flex gap-2"><span className="text-[var(--cyan)]">›</span>{tip}</li>
          ))}
        </ul>
      </SectionCard>
    </div>
  )
}
