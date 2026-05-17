'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { Project } from '@/types'

const sectionVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4 }}
      className="group relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-[var(--border-2)] hover:shadow-[0_20px_60px_rgba(0,212,255,0.08)]"
      onClick={() => project.link && project.link !== '#' && window.open(project.link, '_blank')}
    >
      {project.active && (
        <div className="absolute top-3 right-3 z-10">
          <motion.div
            className="w-2 h-2 rounded-full bg-[var(--green)]"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ boxShadow: '0 0 8px var(--green)' }}
          />
        </div>
      )}

      <div className="relative w-full h-48 overflow-hidden bg-[var(--bg-tertiary)]">
        {project.image_url ? (
          <Image src={project.image_url} alt={project.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-5xl"
            style={{ background: 'linear-gradient(135deg, var(--bg-tertiary), var(--surface-3))' }}
          >
            <span className="transition-transform duration-300 group-hover:scale-110">{project.emoji || '📦'}</span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.05), rgba(168,85,247,0.05))' }} />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-16"
          style={{ background: 'linear-gradient(transparent, var(--surface))' }} />
      </div>

      <div className="p-5">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {(project.tags || []).map(tag => (
            <span key={tag}
              className="font-mono text-[10px] text-[var(--cyan)] bg-[var(--cyan-glow)] border border-[rgba(0,212,255,0.2)] px-2 py-0.5 rounded"
              style={{ letterSpacing: '0.05em' }}
            >{tag}</span>
          ))}
        </div>
        <h3 className="text-lg font-semibold text-[var(--text)] mb-2">{project.name}</h3>
        <p className="text-sm text-[var(--text-2)] leading-relaxed mb-4">{project.description}</p>
        {project.link && project.link !== '#' && (
          <span className="font-mono text-xs text-[var(--cyan)] flex items-center gap-1.5 transition-all duration-200 group-hover:gap-3" style={{ letterSpacing: '0.05em' }}>
            View Project <span>→</span>
          </span>
        )}
      </div>
    </motion.div>
  )
}

export function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section id="section-projects" className="relative z-10 max-w-6xl mx-auto px-6 py-20">
      <div className="flex items-center gap-4 mb-12">
        <span className="font-mono text-xs text-[var(--cyan)]" style={{ letterSpacing: '0.1em' }}>01 —</span>
        <h2 className="text-3xl font-bold text-[var(--text)]">Projects</h2>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, var(--border), transparent)' }} />
      </div>
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {projects.map(p => <ProjectCard key={p.id} project={p} />)}
      </motion.div>
    </section>
  )
}
