'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { SkillGroup } from '@/types'

interface SkillsSectionProps {
  skillGroups: SkillGroup[]
}

function SkillBar({ percentage, delay = 0 }: { percentage: number; delay?: number }) {
  const [width, setWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth(percentage), delay)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [percentage, delay])

  return (
    <div ref={ref} className="h-0.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
      <div
        className="h-full rounded-full skill-bar-fill"
        style={{
          width: `${width}%`,
          background: 'linear-gradient(90deg, var(--cyan), var(--purple))',
        }}
      />
    </div>
  )
}

export function SkillsSection({ skillGroups }: SkillsSectionProps) {
  return (
    <section id="section-skills" className="relative z-10 max-w-6xl mx-auto px-6 py-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-12">
        <span className="font-mono text-xs text-[var(--cyan)]" style={{ letterSpacing: '0.1em' }}>02 —</span>
        <h2 className="text-3xl font-bold text-[var(--text)]">المهارات</h2>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, var(--border), transparent)' }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skillGroups.map((group, gi) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: gi * 0.1 }}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6"
          >
            <h3
              className="font-mono text-xs text-[var(--cyan)] mb-5 uppercase"
              style={{ letterSpacing: '0.1em' }}
            >
              {group.group_name}
            </h3>

            <div className="space-y-4">
              {group.skills.map((skill, si) => (
                <div key={skill.id}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-[var(--text)]">{skill.name}</span>
                    <span className="font-mono text-xs text-[var(--text-3)]">{skill.percentage}%</span>
                  </div>
                  <SkillBar percentage={skill.percentage} delay={gi * 100 + si * 60} />
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
