'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageUploadProps {
  value: string           // current URL or base64
  onChange: (url: string) => void
  label?: string
  hint?: string
  aspectRatio?: string    // e.g. 'aspect-video' | 'aspect-square'
}

export function ImageUpload({ value, onChange, label = 'Image', hint, aspectRatio = 'aspect-video' }: ImageUploadProps) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'upload' | 'url'>('upload')
  const [urlInput, setUrlInput] = useState(value?.startsWith('http') ? value : '')
  const inputRef = useRef<HTMLInputElement>(null)

  async function uploadFile(file: File) {
    if (!file.type.startsWith('image/')) { setError('Only image files allowed'); return }
    if (file.size > 5 * 1024 * 1024) { setError('Max file size is 5MB'); return }

    setUploading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) onChange(data.url)
      else setError(data.error || 'Upload failed')
    } catch { setError('Upload failed — check connection') }
    finally { setUploading(false) }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }

  function handleUrlApply() {
    if (!urlInput.trim()) return
    onChange(urlInput.trim())
  }

  const isImage = value && (value.startsWith('data:image') || value.startsWith('http') || value.startsWith('/'))

  return (
    <div className="mb-5">
      <div className="font-mono text-xs text-[var(--cyan)] block mb-2 uppercase tracking-widest">{label}</div>

      {/* Preview */}
      {isImage && (
        <div className="relative mb-3 rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--bg-tertiary)] group">
          <div className={aspectRatio}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="preview" className="w-full h-full object-cover" />
          </div>
          <button
            onClick={() => onChange('')}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white rounded-lg px-2 py-1 text-xs font-mono hover:bg-red-600/80"
          >
            Remove
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-3">
        {(['upload', 'url'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`font-mono text-xs px-3 py-1.5 rounded-lg transition-colors ${tab === t ? 'bg-[var(--cyan-glow)] text-[var(--cyan)] border border-[rgba(0,212,255,0.2)]' : 'text-[var(--text-3)] hover:text-[var(--text)]'}`}
          >
            {t === 'upload' ? '⬆ Upload File' : '🔗 URL'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'upload' ? (
          <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                dragging
                  ? 'border-[var(--cyan)] bg-[var(--cyan-glow)]'
                  : 'border-[var(--border)] hover:border-[var(--border-2)] hover:bg-[var(--surface-2)]'
              }`}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-6 h-6 border-2 border-[var(--border-2)] border-t-[var(--cyan)] rounded-full" />
                  <span className="font-mono text-xs text-[var(--text-3)]">Uploading...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="text-2xl">{dragging ? '📂' : '🖼️'}</div>
                  <div className="font-mono text-xs text-[var(--text-2)]">
                    {dragging ? 'Drop it!' : 'Drag & drop or click to upload'}
                  </div>
                  <div className="font-mono text-xs text-[var(--text-3)]">PNG, JPG, GIF, WebP, SVG — max 5MB</div>
                </div>
              )}
              <input ref={inputRef} type="file" accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f) }} />
            </div>

            {error && <p className="font-mono text-xs text-[var(--red)] mt-2">{error}</p>}
          </motion.div>
        ) : (
          <motion.div key="url" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleUrlApply()}
                placeholder="https://i.imgur.com/example.png"
                className="flex-1 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-[var(--text)] text-sm outline-none transition-colors focus:border-[var(--cyan-2)] placeholder-[var(--text-3)] font-mono"
              />
              <button onClick={handleUrlApply}
                className="px-4 py-2 rounded-lg bg-[var(--cyan)] text-black font-mono text-xs font-semibold hover:bg-[var(--cyan-2)] transition-colors whitespace-nowrap">
                Apply
              </button>
            </div>
            <p className="font-mono text-xs text-[var(--text-3)] mt-1.5">
              {hint || 'Use a direct image link (imgur, Discord CDN, etc.)'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
