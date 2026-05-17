'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Field, Input, Textarea, SaveBtn, DeleteBtn } from '../FormFields'
import { ImageUpload } from '../ImageUpload'
import type { Project } from '@/types'

interface Props {
  projects: Project[]
  showToast: (msg: string, type?: 'success' | 'error') => void
  onSaved: () => void
}

function newProject(): Project {
  return { id: Math.random().toString(36).slice(2), name: 'New Project', description: 'Project description', tags: [], link: '#', emoji: '📦', image_url: '', active: false, sort_order: 999 }
}

export function AdminProjects({ projects: initial, showToast, onSaved }: Props) {
  const [projects, setProjects] = useState<Project[]>(initial)
  const [loading, setLoading] = useState<string | null>(null)

  const update = (id: string, key: keyof Project, value: unknown) =>
    setProjects(prev => prev.map(p => p.id === id ? { ...p, [key]: value } : p))

  const remove = async (id: string) => {
    if (!confirm('Delete this project?')) return
    setLoading(id)
    try {
      const res = await fetch('/api/projects', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
      if (res.ok) { setProjects(prev => prev.filter(p => p.id !== id)); showToast('Deleted'); onSaved() }
      else showToast('Delete failed', 'error')
    } catch { showToast('Connection error', 'error') }
    finally { setLoading(null) }
  }

  const save = async (project: Project) => {
    setLoading(project.id)
    try {
      const res = await fetch('/api/projects', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(project) })
      if (res.ok) { showToast(`"${project.name}" saved ✓`); onSaved() }
      else showToast('Save failed', 'error')
    } catch { showToast('Connection error', 'error') }
    finally { setLoading(null) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-mono text-xs text-[var(--cyan)] uppercase tracking-widest">Projects ({projects.length})</h2>
        <button onClick={() => setProjects(prev => [...prev, newProject()])}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono text-[var(--green)] bg-[var(--green-glow)] border border-[rgba(0,255,136,0.2)] hover:bg-[rgba(0,255,136,0.2)] transition-colors">
          + Add Project
        </button>
      </div>

      <AnimatePresence initial={false}>
        {projects.map(project => (
          <motion.div key={project.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 mb-3">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 font-mono text-sm text-[var(--text)]">
                  {project.image_url
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={project.image_url} alt="" className="w-6 h-6 rounded object-cover" />
                    : <span>{project.emoji}</span>}
                  <span>{project.name}</span>
                  {project.active && <span className="text-xs text-[var(--green)] border border-[rgba(0,255,136,0.3)] bg-[var(--green-glow)] px-2 py-0.5 rounded-full">active</span>}
                </div>
                <DeleteBtn onClick={() => remove(project.id)} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Project Name">
                  <Input value={project.name} onChange={e => update(project.id, 'name', e.target.value)} />
                </Field>
                <Field label="Emoji (used if no image)">
                  <Input value={project.emoji} onChange={e => update(project.id, 'emoji', e.target.value)} className="w-24" />
                </Field>
              </div>

              <Field label="Description">
                <Textarea value={project.description} onChange={e => update(project.id, 'description', e.target.value)} rows={2} />
              </Field>

              {/* Custom image upload */}
              <ImageUpload
                label="Project Image"
                value={project.image_url || ''}
                onChange={url => update(project.id, 'image_url', url)}
                aspectRatio="aspect-video"
                hint="Upload a custom image or use a URL — shown instead of emoji"
              />

              <Field label="Link">
                <Input value={project.link} onChange={e => update(project.id, 'link', e.target.value)} placeholder="https://github.com/..." />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Tags (comma-separated)">
                  <Input
                    value={(project.tags || []).join(', ')}
                    onChange={e => update(project.id, 'tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                    placeholder="Node.js, React, Supabase"
                  />
                </Field>
                <Field label="Sort Order">
                  <Input type="number" value={project.sort_order} onChange={e => update(project.id, 'sort_order', parseInt(e.target.value) || 0)} className="w-24" />
                </Field>
              </div>

              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <button onClick={() => update(project.id, 'active', !project.active)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${project.active ? 'bg-[var(--green)]' : 'bg-[var(--border-2)]'}`}>
                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${project.active ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                  <span className="text-sm text-[var(--text-2)]">Show active indicator</span>
                </label>
                <SaveBtn loading={loading === project.id} onClick={() => save(project)} label="Save" className="text-xs px-4 py-2" />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {projects.length === 0 && <div className="text-center py-12 text-[var(--text-3)] font-mono text-sm">No projects — click &quot;+ Add Project&quot;</div>}
    </div>
  )
}
