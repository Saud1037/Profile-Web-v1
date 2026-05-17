import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/withAuth'
import { getStoreProjects, readStore, writeStore } from '@/lib/store'

export async function GET() {
  return NextResponse.json(getStoreProjects())
}

export const PUT = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json()
    const current = readStore()
    const idx = current.projects.findIndex(p => p.id === body.id)
    let updated
    if (idx >= 0) {
      updated = current.projects.map(p => p.id === body.id ? { ...p, ...body } : p)
    } else {
      updated = [...current.projects, body]
    }
    writeStore({ projects: updated })
    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 500 })
  }
})

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json()
    const current = readStore()
    writeStore({ projects: [...current.projects, body] })
    return NextResponse.json(body)
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 500 })
  }
})

export const DELETE = withAuth(async (req: NextRequest) => {
  try {
    const { id } = await req.json()
    const current = readStore()
    writeStore({ projects: current.projects.filter(p => p.id !== id) })
    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 500 })
  }
})
