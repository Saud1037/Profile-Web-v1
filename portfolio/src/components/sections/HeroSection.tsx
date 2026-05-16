'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { Profile } from '@/types'

interface HeroSectionProps {
  profile: Profile
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } },
}

function DiscordProfileCard({ profile }: { profile: Profile }) {
  const bannerStyle = profile.banner_url
    ? {}
    : { background: profile.banner_color || 'linear-gradient(135deg, #0d1f3c, #1a1040)' }

  return (
    <motion.div
      variants={item}
      className="w-full max-w-sm rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-[0_20px_80px_rgba(0,0,0,0.4)]"
    >
      {/* Banner */}
      <div className="profile-banner h-28 relative" style={bannerStyle}>
        {profile.banner_url && (
          <Image src={profile.banner_url} alt="banner" fill className="object-cover" />
        )}
        {/* Subtle shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.3)]" />
      </div>

      {/* Avatar */}
      <div className="px-4 pb-4">
        <div className="relative -mt-10 mb-3 inline-block">
          <div className="profile-avatar-ring w-20 h-20 rounded-full overflow-hidden relative">
            {profile.avatar_url ? (
              <Image src={profile.avatar_url} alt={profile.name} fill className="object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-3xl font-bold"
                style={{ background: 'linear-gradient(135deg, var(--cyan), var(--purple))' }}
              >
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          {/* Online indicator */}
          {profile.available_for_work && (
            <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
              <motion.div
                className="w-2.5 h-2.5 rounded-full bg-[var(--green)]"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ boxShadow: '0 0 6px var(--green)' }}
              />
            </div>
          )}
        </div>

        {/* Name + username */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[var(--text)] leading-none">{profile.name}</h2>
            {profile.available_for_work && (
              <span className="font-mono text-[10px] text-[var(--green)] border border-[rgba(0,255,136,0.3)] bg-[var(--green-glow)] px-1.5 py-0.5 rounded-full" style={{ letterSpacing: '0.05em' }}>
                OPEN
              </span>
            )}
          </div>
          <div className="font-mono text-xs text-[var(--text-3)] mt-0.5">@{profile.username}</div>
        </div>

        {/* Role badge */}
        <div className="font-mono text-xs text-[var(--cyan)] bg-[var(--cyan-glow)] border border-[rgba(0,212,255,0.2)] px-2.5 py-1 rounded-md inline-block mb-3" style={{ letterSpacing: '0.06em' }}>
          {profile.role}
        </div>

        {/* Bio */}
        <p className="text-sm text-[var(--text-2)] leading-relaxed mb-4">{profile.bio}</p>

        {/* Divider */}
        <div className="h-px bg-[var(--border)] mb-3" />

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {profile.tags.slice(0, 6).map(tag => (
            <span
              key={tag}
              className="font-mono text-[10px] text-[var(--text-3)] border border-[var(--border)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded"
              style={{ letterSpacing: '0.04em' }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export function HeroSection({ profile }: HeroSectionProps) {
  return (
    <section id="section-home" className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-24">
      <div className="flex flex-col lg:flex-row items-start gap-16">

        {/* Left — text content */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex-1 min-w-0 pt-4"
        >
          {/* System badge */}
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
              sys:portfolio — v2.0
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={item}
            className="text-[clamp(44px,7vw,88px)] font-bold leading-none mb-5 tracking-tight"
          >
            <span className="block text-[var(--text)]">{profile.name}</span>
            <span className="block gradient-text">{profile.role}</span>
          </motion.h1>

          {/* Bio */}
          <motion.p
            variants={item}
            className="text-lg text-[var(--text-2)] max-w-lg leading-relaxed mb-10"
          >
            {profile.bio}
          </motion.p>

          {/* Buttons */}
          <motion.div variants={item} className="flex flex-wrap gap-3 mb-16">
            <button
              onClick={() => document.getElementById('section-projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 rounded-lg font-medium text-sm bg-[var(--cyan)] text-black transition-all duration-200 hover:bg-[var(--cyan-2)] hover:-translate-y-0.5 neon-cyan"
            >
              View Projects
            </button>
            <button
              onClick={() => document.getElementById('section-terminal')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 rounded-lg font-medium text-sm border border-[var(--border-2)] text-[var(--text)] bg-transparent transition-all duration-200 hover:border-[var(--cyan)] hover:text-[var(--cyan)] hover:bg-[var(--cyan-glow)]"
            >
              Open Terminal
            </button>
          </motion.div>

          {/* Stats */}
          {profile.stats?.length > 0 && (
            <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {profile.stats.map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -2 }}
                  className="relative bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 overflow-hidden"
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5"
                    style={{ background: 'linear-gradient(90deg, var(--cyan), var(--purple))' }}
                  />
                  <div className="font-mono text-2xl font-bold gradient-text">{stat.key}</div>
                  <div className="font-mono text-xs text-[var(--text-3)] mt-1" style={{ letterSpacing: '0.05em' }}>
                    {stat.value}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Right — Discord profile card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="lg:w-80 w-full flex-shrink-0"
        >
          <DiscordProfileCard profile={profile} />
        </motion.div>

      </div>
    </section>
  )
}
