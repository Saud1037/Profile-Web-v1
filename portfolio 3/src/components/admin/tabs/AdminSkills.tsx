'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Field, Input, SaveBtn, DeleteBtn } from '../FormFields'
import type { SkillGroup, Skill } from '@/types'

interface Props {
  skillGroups: SkillGroup[]
  showToast: (msg: string, type?: 'success' | 'error') => void
  onSaved: () => void
}

function newSkill(groupId: string): Skill {
  return { id: Math.random().toString(36).slice(2), group_id: groupId, name: 'New Skill', percentage: 75, sort_order: 999 }
}

export function AdminSkills({ skillGroups: initial, showToast, onSaved }: Props) {
  const [groups, setGroups] = useState<SkillGroup[]>(initial)
  const [loading, setLoading] = useState<string | null>(null)

  const updateGroup = (gid: string, key: keyof SkillGroup, value: unknown) =>
    setGroups(prev => prev.map(g => g.id === gid ? { ...g, [key]: value } : g))

  const updateSkill = (gid: string, sid: string, key: keyof Skill, value: unknown) =>
    setGroups(prev => prev.map(g =>
      g.id === gid ? { ...g, skills: g.skills.map(s => s.id === sid ? { ...s, [key]: value } : s) } : g
    ))

  const addSkill = (gid: string) =>
    setGroups(prev => prev.map(g => g.id === gid ? { ...g, skills: [...g.skills, newSkill(gid)] } : g))

  const removeSkill = async (gid: string, sid: string) => {
    setLoading(sid)
    try {
      await fetch('/api/skills', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: sid }) })
      setGroups(prev => prev.map(g => g.id === gid ? { ...g, skills: g.skills.filter(s => s.id !== sid) } : g))
      showToast('Skill deleted')
    } catch { showToast('Delete failed', 'error') }
    finally { setLoading(null) }
  }

  const saveGroup = async (group: SkillGroup) => {
    setLoading(group.id)
    try {
      await fetch('/api/skills', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'group', data: { id: group.id, group_name: group.group_name, sort_order: group.sort_order } }),
      })
      await Promise.all(group.skills.map(skill =>
        fetch('/api/skills', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'skill', data: skill }) })
      ))
      showToast(`"${group.group_name}" saved ✓`)
      onSaved()
    } catch { showToast('Save failed', 'error') }
    finally { setLoading(null) }
  }

  return (
    <div>
      {groups.map(group => (
        <div key={group.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 mb-4">
          <div className="flex items-center gap-3 mb-5">
            <Field label="Group Name" className="flex-1 mb-0">
              <Input value={group.group_name} onChange={e => updateGroup(group.id, 'group_name', e.target.value)} />
            </Field>
            <Field label="Order" className="w-24 mb-0">
              <Input type="number" value={group.sort_order} onChange={e => updateGroup(group.id, 'sort_order', parseInt(e.target.value) || 0)} />
            </Field>
          </div>

          <div className="space-y-2 mb-4">
            <div className="font-mono text-xs text-[var(--text-3)] mb-2 uppercase tracking-widest">Skills</div>
            <AnimatePresence initial={false}>
              {group.skills.map(skill => (
                <motion.div key={skill.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-3 bg-[var(--surface-2)] rounded-lg px-4 py-3">
                  <Input value={skill.name} onChange={e => updateSkill(group.id, skill.id, 'name', e.target.value)} placeholder="Skill name" className="flex-1" />
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Input type="number" min={0} max={100} value={skill.percentage} onChange={e => updateSkill(group.id, skill.id, 'percentage', parseInt(e.target.value) || 0)} className="w-20 text-center" />
                    <span className="font-mono text-xs text-[var(--text-3)]">%</span>
                    <DeleteBtn onClick={() => removeSkill(group.id, skill.id)} label="×" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <button onClick={() => addSkill(group.id)} className="w-full py-2 font-mono text-xs text-[var(--text-3)] border border-dashed border-[var(--border)] rounded-lg hover:border-[var(--border-2)] hover:text-[var(--text-2)] transition-colors">
              + Add Skill
            </button>
          </div>

          <SaveBtn loading={loading === group.id} onClick={() => saveGroup(group)} label="Save Group" className="text-xs" />
        </div>
      ))}
      {groups.length === 0 && <div className="text-center py-12 text-[var(--text-3)] font-mono text-sm">No skill groups found.</div>}
    </div>
  )
}
