'use client'

import { motion } from 'framer-motion'
import type { SocialLink } from '@/types'

interface SocialSectionProps {
  socialLinks: SocialLink[]
}

export function SocialSection({ socialLinks }: SocialSectionProps) {
  return (
    <section id="section-social" className="relative z-10 max-w-6xl mx-auto px-6 py-10 pb-20">
      <div className="flex items-center gap-4 mb-10">
        <span className="font-mono text-xs text-[var(--cyan)]" style={{ letterSpacing: '0.1em' }}>03 —</span>
        <h2 className="text-3xl font-bold text-[var(--text)]">التواصل</h2>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, var(--border), transparent)' }} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {socialLinks.map((link, i) => (
          <motion.a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            whileHover={{ y: -3 }}
            className="flex items-center gap-3 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl cursor-pointer transition-all duration-200 hover:border-[var(--border-2)] hover:bg-[var(--surface-2)] no-underline"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: `${link.color}22` }}
            >
              {link.icon}
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--text)]">{link.platform}</div>
              <div className="font-mono text-xs text-[var(--text-3)] mt-0.5">{link.handle}</div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  )
}
