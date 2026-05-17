'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { AdminGeneral } from './tabs/AdminGeneral'
import { AdminProjects } from './tabs/AdminProjects'
import { AdminSkills } from './tabs/AdminSkills'
import { AdminSocial } from './tabs/AdminSocial'
import { AdminSecurity } from './tabs/AdminSecurity'
import { AdminTheme } from './tabs/AdminTheme'
import type { SiteData, ThemeColors } from '@/types'

const tabs = [
  { id: 'general',  label: 'General',  icon: '⚙️' },
  { id: 'projects', label: 'Projects', icon: '📦' },
  { id: 'skills',   label: 'Skills',   icon: '📊' },
  { id: 'social',   label: 'Social',   icon: '🔗' },
  { id: 'theme',    label: 'Theme',    icon: '🎨' },
  { id: 'security', label: 'Security', icon: '🔐' },
]

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('general')
  const [data, setData] = useState<SiteData | null>(null)
  const [theme, setTheme] = useState<ThemeColors | null>(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const router = useRouter()

  useEffect(() => { fetchAllData() }, [])

  async function fetchAllData() {
    setLoading(true)
    try {
      const [pR, prR, skR, soR, thR] = await Promise.all([
        fetch('/api/profile'), fetch('/api/projects'), fetch('/api/skills'), fetch('/api/social'), fetch('/api/theme'),
      ])
      const [profile, projects, skillGroups, socialLinks, themeData] = await Promise.all([
        pR.json(), prR.json(), skR.json(), soR.json(), thR.json(),
      ])
      setData({ profile, projects, skillGroups, socialLinks })
      setTheme(themeData)
    } catch { showToast('Failed to load data', 'error') }
    finally { setLoading(false) }
  }

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/')
    router.refresh()
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center relative z-10">
      <div className="text-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-2 border-[var(--border-2)] border-t-[var(--cyan)] rounded-full mx-auto mb-4" />
        <p className="font-mono text-sm text-[var(--text-3)]">Loading admin panel...</p>
      </div>
    </div>
  )

  if (!data || !theme) return null

  return (
    <div className="min-h-screen relative z-10 flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-40 glass border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm">⚙️</span>
            <span className="font-mono text-sm text-[var(--text)]">Admin Panel</span>
            <span className="font-mono text-xs text-[var(--text-3)] hidden sm:inline">— {data.profile.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="font-mono text-xs text-[var(--text-3)] hover:text-[var(--cyan)] transition-colors px-3 py-1.5 rounded border border-transparent hover:border-[var(--border)]">
              ← Back to site
            </a>
            <button onClick={handleLogout} className="font-mono text-xs text-[var(--red)] hover:bg-[rgba(255,68,68,0.1)] transition-colors px-3 py-1.5 rounded border border-transparent hover:border-[rgba(255,68,68,0.2)]">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="md:w-52 flex-shrink-0">
          <nav className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-2 md:sticky md:top-24">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 mb-1 last:mb-0 text-left ${
                  activeTab === tab.id
                    ? 'bg-[var(--cyan-glow)] text-[var(--cyan)] border border-[rgba(0,212,255,0.2)]'
                    : 'text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] border border-transparent'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              {activeTab === 'general'  && <AdminGeneral  profile={data.profile}          showToast={showToast} onSaved={fetchAllData} />}
              {activeTab === 'projects' && <AdminProjects projects={data.projects}         showToast={showToast} onSaved={fetchAllData} />}
              {activeTab === 'skills'   && <AdminSkills   skillGroups={data.skillGroups}  showToast={showToast} onSaved={fetchAllData} />}
              {activeTab === 'social'   && <AdminSocial   socialLinks={data.socialLinks}  showToast={showToast} onSaved={fetchAllData} />}
              {activeTab === 'theme'    && <AdminTheme    theme={theme}                    showToast={showToast} onSaved={fetchAllData} />}
              {activeTab === 'security' && <AdminSecurity showToast={showToast} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl font-mono text-sm shadow-xl ${toast.type === 'error' ? 'toast-error' : 'toast'}`}
          >
            {toast.type === 'success' ? '✓ ' : '✗ '}{toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
