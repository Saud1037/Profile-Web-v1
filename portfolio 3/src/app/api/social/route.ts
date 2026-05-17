import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/withAuth'
import { getStoreSocialLinks, readStore, writeStore } from '@/lib/store'

export async function GET() {
  return NextResponse.json(getStoreSocialLinks())
}

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json()
    const current = readStore()
    const idx = current.socialLinks.findIndex(l => l.id === body.id)
    let updated
    if (idx >= 0) {
      updated = current.socialLinks.map(l => l.id === body.id ? { ...l, ...body } : l)
    } else {
      updated = [...current.socialLinks, body]
    }
    writeStore({ socialLinks: updated })
    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 500 })
  }
})

export const DELETE = withAuth(async (req: NextRequest) => {
  try {
    const { id } = await req.json()
    const current = readStore()
    writeStore({ socialLinks: current.socialLinks.filter(l => l.id !== id) })
    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 500 })
  }
})
