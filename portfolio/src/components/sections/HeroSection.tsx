'use client'

import { motion } from 'framer-motion'
import type { Profile } from '@/types'

interface HeroSectionProps {
  profile: Profile
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
}

export function HeroSection({ profile }: HeroSectionProps) {
  return (
    <section id="section-home" className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-24">
      <motion.div variants={container} initial="hidden" animate="show">
        {/* Badge */}
        {profile.available_for_work && (
          <motion.div variants={item} className="inline-flex items-center gap-2 mb-8">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs text-[var(--cyan)] border border-[var(--border-2)] bg-[var(--surface)]"
              style={{ letterSpacing: '0.08em' }}
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)]"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              متاح للعمل الحر
            </div>
          </motion.div>
        )}

        {/* Name */}
        <motion.h1 variants={item} className="text-[clamp(48px,8vw,96px)] font-bold leading-none mb-5 tracking-tight">
          <span className="block text-[var(--text)]">{profile.name}</span>
          <span className="block gradient-text">{profile.role}</span>
        </motion.h1>

        {/* Bio */}
        <motion.p
          variants={item}
          className="text-lg text-[var(--text-2)] max-w-xl leading-relaxed mb-10"
        >
          {profile.bio}
        </motion.p>

        {/* Tags */}
        <motion.div variants={item} className="flex flex-wrap gap-2 mb-10">
          {profile.tags.map(tag => (
            <span
              key={tag}
              className="font-mono text-xs text-[var(--text-2)] border border-[var(--border-2)] bg-[var(--surface)] px-3 py-1.5 rounded-md cursor-default transition-all duration-200 hover:border-[var(--cyan-2)] hover:text-[var(--cyan)] hover:bg-[var(--cyan-glow)]"
              style={{ letterSpacing: '0.05em' }}
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Buttons */}
        <motion.div variants={item} className="flex flex-wrap gap-3 mb-20">
          <a
            href="#section-projects"
            onClick={e => {
              e.preventDefault()
              document.getElementById('section-projects')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="px-6 py-3 rounded-lg font-medium text-sm bg-[var(--cyan)] text-black transition-all duration-200 hover:bg-[var(--cyan-2)] hover:-translate-y-0.5 neon-cyan"
          >
            عرض المشاريع
          </a>
          <a
            href="#section-terminal"
            onClick={e => {
              e.preventDefault()
              document.getElementById('section-terminal')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="px-6 py-3 rounded-lg font-medium text-sm border border-[var(--border-2)] text-[var(--text)] bg-transparent transition-all duration-200 hover:border-[var(--cyan)] hover:text-[var(--cyan)] hover:bg-[var(--cyan-glow)]"
          >
            فتح Terminal
          </a>
        </motion.div>

        {/* Stats */}
        {profile.stats && profile.stats.length > 0 && (
          <motion.div
            variants={item}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {profile.stats.map((stat, i) => (
              <motion.div
                key={i}
                className="relative bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 overflow-hidden card-hover"
                whileHover={{ y: -2 }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ background: 'linear-gradient(90deg, var(--cyan), var(--purple))' }}
                />
                <div className="font-mono text-3xl font-bold gradient-text">{stat.key}</div>
                <div className="font-mono text-xs text-[var(--text-3)] mt-1" style={{ letterSpacing: '0.05em' }}>
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
