'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import type { SiteData } from '@/types'

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'success' | 'info' | 'divider'
  content: string
}

const WELCOME: TerminalLine[] = [
  { type: 'divider', content: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' },
  { type: 'success', content: '   نظام شخصي v2.0.1 — مرحباً بك' },
  { type: 'divider', content: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' },
  { type: 'output', content: '' },
  { type: 'output', content: 'اكتب [help] لعرض الأوامر المتاحة' },
]

interface TerminalSectionProps {
  data: SiteData
}

export function TerminalSection({ data }: TerminalSectionProps) {
  const [lines, setLines] = useState<TerminalLine[]>(WELCOME)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { profile, projects, skillGroups, socialLinks } = data

  const addLines = useCallback((newLines: TerminalLine[]) => {
    setLines(prev => [...prev, ...newLines])
  }, [])

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [lines])

  const processCommand = useCallback(
    (raw: string) => {
      const cmd = raw.trim().toLowerCase()

      addLines([{ type: 'input', content: raw }])

      switch (cmd) {
        case 'help':
          addLines([
            { type: 'output', content: '' },
            { type: 'info', content: 'الأوامر المتاحة:' },
            { type: 'output', content: '  help        — عرض الأوامر' },
            { type: 'output', content: '  about       — نبذة عني' },
            { type: 'output', content: '  projects    — عرض المشاريع' },
            { type: 'output', content: '  skills      — المهارات التقنية' },
            { type: 'output', content: '  contact     — معلومات التواصل' },
            { type: 'output', content: '  whoami      — من أنا؟' },
            { type: 'output', content: '  uptime      — وقت التشغيل' },
            { type: 'output', content: '  clear       — مسح الشاشة' },
            { type: 'output', content: '  date        — التاريخ والوقت الحالي' },
            { type: 'output', content: '  echo [text] — طباعة نص' },
            { type: 'output', content: '' },
          ])
          break

        case 'about':
          addLines([
            { type: 'output', content: '' },
            { type: 'success', content: `┌─ ${profile.name} ──────────────────────────────────` },
            { type: 'output', content: `│ الدور:   ${profile.role}` },
            { type: 'output', content: `│ نبذة:   ${profile.bio}` },
            { type: 'output', content: `│ المهارات: ${profile.tags.join(' • ')}` },
            { type: 'success', content: '└────────────────────────────────────────────────' },
            { type: 'output', content: '' },
          ])
          break

        case 'projects':
          addLines([
            { type: 'output', content: '' },
            { type: 'info', content: `المشاريع (${projects.length}):` },
            ...projects.map(p => ({
              type: 'output' as const,
              content: `  ${p.emoji}  ${p.name} — ${p.description.substring(0, 55)}...`,
            })),
            { type: 'output', content: '' },
          ])
          break

        case 'skills':
          addLines([{ type: 'output', content: '' }])
          skillGroups.forEach(g => {
            addLines([{ type: 'info', content: `[ ${g.group_name} ]` }])
            g.skills.forEach(s => {
              const filled = Math.floor(s.percentage / 10)
              const bar = '█'.repeat(filled) + '░'.repeat(10 - filled)
              addLines([{
                type: 'output',
                content: `  ${s.name.padEnd(20)} ${bar} ${s.percentage}%`,
              }])
            })
          })
          addLines([{ type: 'output', content: '' }])
          break

        case 'contact':
          addLines([
            { type: 'output', content: '' },
            { type: 'info', content: 'معلومات التواصل:' },
            ...socialLinks.map(s => ({
              type: 'output' as const,
              content: `  ${s.icon}  ${s.platform}: ${s.handle}`,
            })),
            { type: 'output', content: '' },
          ])
          break

        case 'whoami':
          addLines([{ type: 'success', content: profile.name }])
          break

        case 'uptime':
          addLines([{
            type: 'success',
            content: `نظام يعمل بكامل طاقته • ${Math.floor(Math.random() * 900) + 100} ساعة`,
          }])
          break

        case 'date':
          addLines([{
            type: 'output',
            content: new Date().toLocaleString('ar-SA', {
              weekday: 'long', year: 'numeric', month: 'long',
              day: 'numeric', hour: '2-digit', minute: '2-digit',
            }),
          }])
          break

        case 'clear':
          setLines([])
          break

        case '':
          break

        default:
          if (cmd.startsWith('echo ')) {
            addLines([{ type: 'output', content: raw.slice(5) }])
          } else {
            addLines([
              { type: 'error', content: `bash: ${raw}: command not found` },
              { type: 'output', content: 'اكتب [help] للمساعدة' },
            ])
          }
      }
    },
    [addLines, profile, projects, skillGroups, socialLinks]
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = input
      if (cmd.trim()) {
        setHistory(prev => [cmd, ...prev.slice(0, 49)])
      }
      setHistoryIdx(-1)
      processCommand(cmd)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const nextIdx = Math.min(historyIdx + 1, history.length - 1)
      setHistoryIdx(nextIdx)
      setInput(history[nextIdx] || '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const nextIdx = Math.max(historyIdx - 1, -1)
      setHistoryIdx(nextIdx)
      setInput(nextIdx === -1 ? '' : history[nextIdx])
    }
  }

  const lineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'input': return 'text-[var(--cyan)]'
      case 'success': return 'text-[var(--green)]'
      case 'error': return 'text-[var(--red)]'
      case 'info': return 'text-[var(--amber)]'
      case 'divider': return 'text-[var(--green)]'
      default: return 'text-[var(--text-2)]'
    }
  }

  return (
    <section id="section-terminal" className="relative z-10 max-w-6xl mx-auto px-6 py-20">
      <div className="flex items-center gap-4 mb-12">
        <span className="font-mono text-xs text-[var(--cyan)]" style={{ letterSpacing: '0.1em' }}>04 —</span>
        <h2 className="text-3xl font-bold text-[var(--text)]">Terminal</h2>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, var(--border), transparent)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-[#0a0f16] border border-[var(--border)] rounded-xl overflow-hidden"
      >
        {/* Title bar */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[var(--surface)] border-b border-[var(--border)]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 text-center font-mono text-xs text-[var(--text-3)]" style={{ letterSpacing: '0.05em' }}>
            bash — {profile.name}@portfolio
          </div>
          <div className="font-mono text-xs text-[var(--text-3)]">zsh</div>
        </div>

        {/* Output */}
        <div
          ref={outputRef}
          className="p-5 min-h-72 max-h-96 overflow-y-auto"
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((line, i) => (
            <div key={i} className={`font-mono text-sm leading-relaxed ${lineColor(line.type)}`}>
              {line.type === 'input' ? (
                <span>
                  <span className="text-[var(--green)]">❯ </span>
                  {line.content}
                </span>
              ) : (
                line.content || '\u00a0'
              )}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 px-5 py-3 border-t border-[var(--border)]">
          <span className="font-mono text-sm text-[var(--green)] select-none">❯</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="اكتب أمراً..."
            className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-[var(--cyan)] placeholder-[var(--text-3)] caret-[var(--cyan)]"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            dir="ltr"
          />
          <span className="cursor-blink" />
        </div>
      </motion.div>

      {/* Footer hint */}
      <p className="mt-3 font-mono text-xs text-[var(--text-3)] text-center" style={{ letterSpacing: '0.05em' }}>
        ↑↓ للتنقل في السجل • اكتب help للمساعدة
      </p>
    </section>
  )
}
