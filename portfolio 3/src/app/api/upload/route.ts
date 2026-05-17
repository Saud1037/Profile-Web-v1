import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/withAuth'
import fs from 'fs'
import path from 'path'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    // Validate type
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'Only images allowed (jpg, png, gif, webp, svg)' }, { status: 400 })
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
    }

    const ext = file.name.split('.').pop() || 'png'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    // Try to save to disk
    let url: string
    try {
      if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })
      const buffer = Buffer.from(await file.arrayBuffer())
      fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer)
      url = `/uploads/${filename}`
    } catch {
      // Vercel: convert to base64 data URL (stored in JSON)
      const buffer = await file.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')
      url = `data:${file.type};base64,${base64}`
    }

    return NextResponse.json({ url })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Upload failed' }, { status: 500 })
  }
})
