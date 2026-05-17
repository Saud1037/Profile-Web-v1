'use client'

import { useState } from 'react'
import { SaveBtn, SectionCard } from '../FormFields'
import type { ThemeColors } from '@/types'

interface Props {
  theme: ThemeColors
  showToast: (msg: string, type?: 'success' | 'error') => void
  onSaved: () => void
}

const PRESETS: { name: string; colors: ThemeColors }[] = [
  {
    name: 'Cyber Cyan (Default)',
    colors: { cyan: '#00d4ff', purple: '#a855f7', green: '#00ff88', bgPrimary: '#080c14', bgSecondary: '#0d1117', surface: '#0f1923', border: '#1e3a4a', text: '#e2e8f0', textMuted: '#64748b' },
  },
  {
    name: 'Neon Purple',
    colors: { cyan: '#c084fc', purple: '#7c3aed', green: '#4ade80', bgPrimary: '#0c0a14', bgSecondary: '#110f1c', surface: '#17142a', border: '#2e2a4a', text: '#f0e8ff', textMuted: '#7c6fa0' },
  },
  {
    name: 'Matrix Green',
    colors: { cyan: '#00ff88', purple: '#22c55e', green: '#86efac', bgPrimary: '#030a03', bgSecondary: '#061006', surface: '#091409', border: '#1a3a1a', text: '#dcfce7', textMuted: '#4a7a4a' },
  },
  {
    name: 'Solar Orange',
    colors: { cyan: '#fb923c', purple: '#f59e0b', green: '#34d399', bgPrimary: '#0c0804', bgSecondary: '#110d06', surface: '#18120a', border: '#3a2a1a', text: '#fef3c7', textMuted: '#78604a' },
  },
  {
    name: 'Blood Red',
    colors: { cyan: '#f87171', purple: '#ef4444', green: '#00ff88', bgPrimary: '#0c0404', bgSecondary: '#110606', surface: '#180a0a', border: '#3a1a1a', text: '#fee2e2', textMuted: '#7a4a4a' },
  },
  {
    name: 'Ice Blue',
    colors: { cyan: '#7dd3fc', purple: '#818cf8', green: '#6ee7b7', bgPrimary: '#040810', bgSecondary: '#070d1a', surface: '#0a1228', border: '#1e2a4a', text: '#dbeafe', textMuted: '#4a6a8a' },
  },
]

const COLOR_FIELDS: { key: keyof ThemeColors; label: string; hint: string }[] = [
  { key: 'cyan',        label: 'Accent / Cyan',      hint: 'Main accent color — nav, terminal, links' },
  { key: 'purple',      label: 'Gradient End',        hint: 'Second gradient color — titles, progress bars' },
  { key: 'green',       label: 'Success / Online',    hint: 'Active indicators, success messages' },
  { key: 'bgPrimary',   label: 'Background Primary',  hint: 'Main page background' },
  { key: 'bgSecondary', label: 'Background Secondary', hint: 'Cards and panels background' },
  { key: 'surface',     label: 'Surface',             hint: 'Elevated surfaces and nav' },
  { key: 'border',      label: 'Border',              hint: 'Card and input borders' },
  { key: 'text',        label: 'Text Primary',        hint: 'Main readable text' },
  { key: 'textMuted',   label: 'Text Muted',          hint: 'Secondary and hint text' },
]

export function AdminTheme({ theme: initial, showToast, onSaved }: Props) {
  const [theme, setTheme] = useState<ThemeColors>(initial)
  const [loading, setLoading] = useState(false)

  const setColor = (key: keyof ThemeColors, val: string) =>
    setTheme(prev => ({ ...prev, [key]: val }))

  const applyPreset = (preset: typeof PRESETS[0]) => setTheme(preset.colors)

  async function handleSave() {
    setLoading(true)
    try {
      const res = await fetch('/api/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(theme),
      })
      if (res.ok) {
        // Apply CSS variables live immediately
        applyThemeToDOM(theme)
        showToast('Theme saved ✓ — reload to see full effect')
        onSaved()
      } else showToast('Save failed', 'error')
    } catch { showToast('Connection error', 'error') }
    finally { setLoading(false) }
  }

  function applyThemeToDOM(t: ThemeColors) {
    const root = document.documentElement
    root.style.setProperty('--cyan', t.cyan)
    root.style.setProperty('--purple', t.purple)
    root.style.setProperty('--green', t.green)
    root.style.setProperty('--bg-primary', t.bgPrimary)
    root.style.setProperty('--bg-secondary', t.bgSecondary)
    root.style.setProperty('--surface', t.surface)
    root.style.setProperty('--border', t.border)
    root.style.setProperty('--text', t.text)
    root.style.setProperty('--text-3', t.textMuted)
    // Derived
    root.style.setProperty('--cyan-glow', `${t.cyan}26`)
    root.style.setProperty('--green-glow', `${t.green}1f`)
  }

  // Live preview while changing
  function handleColorChange(key: keyof ThemeColors, val: string) {
    setColor(key, val)
    applyThemeToDOM({ ...theme, [key]: val })
  }

  return (
    <div>
      {/* Presets */}
      <SectionCard title="Quick Presets">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PRESETS.map(preset => (
            <button
              key={preset.name}
              onClick={() => { applyPreset(preset); applyThemeToDOM(preset.colors) }}
              className="relative p-3 rounded-xl border border-[var(--border)] hover:border-[var(--border-2)] transition-all group overflow-hidden text-left"
            >
              {/* Color strip */}
              <div className="flex gap-1 mb-2">
                {[preset.colors.cyan, preset.colors.purple, preset.colors.green, preset.colors.bgSecondary].map((c, i) => (
                  <div key={i} className="h-2 flex-1 rounded-full" style={{ background: c }} />
                ))}
              </div>
              <div className="font-mono text-xs text-[var(--text-2)] group-hover:text-[var(--text)] transition-colors leading-tight">
                {preset.name}
              </div>
            </button>
          ))}
        </div>
      </SectionCard>

      {/* Manual color pickers */}
      <SectionCard title="Custom Colors">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {COLOR_FIELDS.map(({ key, label, hint }) => (
            <div key={key} className="flex items-center gap-3 bg-[var(--surface-2)] rounded-lg px-4 py-3">
              <input
                type="color"
                value={theme[key]}
                onChange={e => handleColorChange(key, e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border border-[var(--border)] flex-shrink-0 bg-transparent"
              />
              <div className="min-w-0">
                <div className="font-mono text-xs text-[var(--text)] font-medium">{label}</div>
                <div className="font-mono text-xs text-[var(--text-3)] truncate">{hint}</div>
                <div className="font-mono text-xs text-[var(--cyan)] mt-0.5">{theme[key]}</div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Live preview bar */}
      <SectionCard title="Live Preview">
        <div className="rounded-xl overflow-hidden border border-[var(--border)]" style={{ background: theme.bgPrimary }}>
          <div className="px-4 py-3 flex items-center gap-3" style={{ background: theme.surface, borderBottom: `1px solid ${theme.border}` }}>
            <div className="w-2 h-2 rounded-full" style={{ background: theme.cyan, boxShadow: `0 0 8px ${theme.cyan}` }} />
            <span className="font-mono text-xs" style={{ color: theme.textMuted }}>sys:</span>
            <span className="font-mono text-xs font-medium" style={{ color: theme.text }}>saud</span>
            <span className="font-mono text-xs" style={{ color: theme.cyan }}>.dev</span>
          </div>
          <div className="p-6">
            <div className="text-2xl font-bold mb-1" style={{ background: `linear-gradient(135deg, ${theme.cyan}, ${theme.purple})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Developer • Innovator
            </div>
            <div className="text-sm mb-4" style={{ color: theme.textMuted }}>A developer building exceptional digital experiences.</div>
            <div className="flex gap-2 flex-wrap">
              {['JavaScript', 'Node.js', 'React'].map(tag => (
                <span key={tag} className="font-mono text-xs px-2 py-1 rounded" style={{ color: theme.cyan, background: `${theme.cyan}20`, border: `1px solid ${theme.cyan}33` }}>
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 h-1 rounded-full overflow-hidden" style={{ background: theme.border }}>
              <div className="h-full w-4/5 rounded-full" style={{ background: `linear-gradient(90deg, ${theme.cyan}, ${theme.purple})` }} />
            </div>
          </div>
        </div>
      </SectionCard>

      <SaveBtn loading={loading} onClick={handleSave} label="Save Theme" />
    </div>
  )
}
