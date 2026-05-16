'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import type { SiteData } from '@/types'

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'success' | 'info' | 'divider' | 'warning'
  content: string
}

const WELCOME: TerminalLine[] = [
  { type: 'divider', content: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' },
  { type: 'success', content: '   personal-system v2.0.1 — welcome' },
  { type: 'divider', content: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' },
  { type: 'output', content: '' },
  { type: 'output', content: 'Type [help] to see available commands.' },
]

export function TerminalSection({ data }: { data: SiteData }) {
  const [lines, setLines] = useState<TerminalLine[]>(WELCOME)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [adminMode, setAdminMode] = useState(false)
  const [adminInput, setAdminInput] = useState('')
  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const { profile, projects, skillGroups, socialLinks } = data

  const addLines = useCallback((newLines: TerminalLine[]) => {
    setLines(prev => [...prev, ...newLines])
  }, [])

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight
  }, [lines])

  const processCommand = useCallback((raw: string) => {
    const cmd = raw.trim().toLowerCase()
    addLines([{ type: 'input', content: raw }])

    switch (cmd) {
      case 'help':
        addLines([
          { type: 'output', content: '' },
          { type: 'info', content: 'Available commands:' },
          { type: 'output', content: '  help         — show this list' },
          { type: 'output', content: '  about        — about me' },
          { type: 'output', content: '  projects     — list projects' },
          { type: 'output', content: '  skills       — tech skills' },
          { type: 'output', content: '  contact      — social links' },
          { type: 'output', content: '  whoami       — who am I?' },
          { type: 'output', content: '  uptime       — system uptime' },
          { type: 'output', content: '  date         — current date & time' },
          { type: 'output', content: '  clear        — clear screen' },
          { type: 'output', content: '  echo [text]  — print text' },
          { type: 'output', content: '  admin        — open admin panel' },
          { type: 'output', content: '' },
        ])
        break

      case 'about':
        addLines([
          { type: 'output', content: '' },
          { type: 'success', content: `┌─ ${profile.name} (@${profile.username}) ${'─'.repeat(20)}` },
          { type: 'output', content: `│  Role    : ${profile.role}` },
          { type: 'output', content: `│  Bio     : ${profile.bio}` },
          { type: 'output', content: `│  Stack   : ${profile.tags.join(' • ')}` },
          { type: 'output', content: `│  Status  : ${profile.available_for_work ? '🟢 Open to work' : '🔴 Not available'}` },
          { type: 'success', content: `└${'─'.repeat(44)}` },
          { type: 'output', content: '' },
        ])
        break

      case 'projects':
        addLines([
          { type: 'output', content: '' },
          { type: 'info', content: `Projects (${projects.length}):` },
          ...projects.map(p => ({
            type: 'output' as const,
            content: `  ${p.emoji}  ${p.name.padEnd(24)} ${p.active ? '🟢' : '⚪'}  ${p.description.substring(0, 48)}...`,
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
            addLines([{ type: 'output', content: `  ${s.name.padEnd(22)} ${bar}  ${s.percentage}%` }])
          })
        })
        addLines([{ type: 'output', content: '' }])
        break

      case 'contact':
        addLines([
          { type: 'output', content: '' },
          { type: 'info', content: 'Social links:' },
          ...socialLinks.map(s => ({
            type: 'output' as const,
            content: `  ${s.icon}  ${s.platform.padEnd(16)} ${s.handle}`,
          })),
          { type: 'output', content: '' },
        ])
        break

      case 'whoami':
        addLines([{ type: 'success', content: `${profile.name} — @${profile.username}` }])
        break

      case 'uptime':
        addLines([{ type: 'success', content: `System running for ${Math.floor(Math.random() * 900) + 100}h 🟢` }])
        break

      case 'date':
        addLines([{ type: 'output', content: new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }])
        break

      case 'clear':
        setLines([])
        break

      case 'admin':
      case 'sudo admin':
      case 'sudo su':
        addLines([
          { type: 'output', content: '' },
          { type: 'warning', content: '🔐 Admin access required.' },
          { type: 'output', content: 'Enter password:' },
        ])
        setAdminMode(true)
        break

      case '':
        break

      default:
        if (cmd.startsWith('echo ')) {
          addLines([{ type: 'output', content: raw.slice(5) }])
        } else {
          addLines([
            { type: 'error', content: `bash: ${raw}: command not found` },
            { type: 'output', content: 'Type [help] for available commands.' },
          ])
        }
    }
  }, [addLines, profile, projects, skillGroups, socialLinks])

  const handleAdminPassword = useCallback(async (pwd: string) => {
    addLines([{ type: 'input', content: '••••••••' }])
    setAdminMode(false)
    setAdminInput('')

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd }),
      })
      if (res.ok) {
        addLines([
          { type: 'success', content: '✓ Authentication successful.' },
          { type: 'success', content: '  Redirecting to admin panel...' },
          { type: 'output', content: '' },
        ])
        setTimeout(() => router.push('/admin'), 800)
      } else {
        addLines([
          { type: 'error', content: '✗ Authentication failed: incorrect password.' },
          { type: 'output', content: '' },
        ])
      }
    } catch {
      addLines([{ type: 'error', content: '✗ Connection error.' }])
    }
  }, [addLines, router])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (adminMode) {
      if (e.key === 'Enter') handleAdminPassword(adminInput)
      if (e.key === 'Escape') {
        setAdminMode(false)
        setAdminInput('')
        addLines([{ type: 'output', content: 'Cancelled.' }])
      }
      return
    }
    if (e.key === 'Enter') {
      const cmd = input
      if (cmd.trim()) setHistory(prev => [cmd, ...prev.slice(0, 49)])
      setHistoryIdx(-1)
      processCommand(cmd)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const idx = Math.min(historyIdx + 1, history.length - 1)
      setHistoryIdx(idx)
      setInput(history[idx] || '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const idx = Math.max(historyIdx - 1, -1)
      setHistoryIdx(idx)
      setInput(idx === -1 ? '' : history[idx])
    }
  }

  const lineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'input': return 'text-[var(--cyan)]'
      case 'success': return 'text-[var(--green)]'
      case 'error': return 'text-[var(--red)]'
      case 'info': return 'text-[var(--amber)]'
      case 'warning': return 'text-[var(--amber)]'
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
          <div className="flex-1 text-center font-mono text-xs text-[var(--text-3)]">bash — {profile.username}@portfolio</div>
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
              {line.type === 'input'
                ? <span><span className="text-[var(--green)]">❯ </span>{line.content}</span>
                : line.content || '\u00a0'}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 px-5 py-3 border-t border-[var(--border)]">
          <span className="font-mono text-sm text-[var(--green)] select-none">❯</span>
          <input
            ref={inputRef}
            value={adminMode ? adminInput : input}
            onChange={e => adminMode ? setAdminInput(e.target.value) : setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            type={adminMode ? 'password' : 'text'}
            placeholder={adminMode ? 'Enter password...' : 'Type a command...'}
            className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-[var(--cyan)] placeholder-[var(--text-3)] caret-[var(--cyan)]"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <span className="cursor-blink" />
        </div>
      </motion.div>

      <p className="mt-3 font-mono text-xs text-[var(--text-3)] text-center" style={{ letterSpacing: '0.05em' }}>
        ↑↓ history navigation • type <span className="text-[var(--cyan)]">help</span> to get started
      </p>
    </section>
  )
}
