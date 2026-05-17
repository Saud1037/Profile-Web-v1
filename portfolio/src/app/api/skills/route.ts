import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/withAuth'
import { getStoreSkillGroups, readStore, writeStore } from '@/lib/store'

export async function GET() {
  return NextResponse.json(getStoreSkillGroups())
}

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json()
    const current = readStore()

    if (body.type === 'group') {
      const { data } = body
      const idx = current.skillGroups.findIndex(g => g.id === data.id)
      let groups
      if (idx >= 0) {
        groups = current.skillGroups.map(g => g.id === data.id ? { ...g, ...data } : g)
      } else {
        groups = [...current.skillGroups, { ...data, skills: [] }]
      }
      writeStore({ skillGroups: groups })
    } else {
      // skill upsert
      const { data } = body
      const groups = current.skillGroups.map(g => {
        if (g.id !== data.group_id) return g
        const si = g.skills.findIndex(s => s.id === data.id)
        if (si >= 0) {
          return { ...g, skills: g.skills.map(s => s.id === data.id ? { ...s, ...data } : s) }
        }
        return { ...g, skills: [...g.skills, data] }
      })
      writeStore({ skillGroups: groups })
    }
    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 500 })
  }
})

export const DELETE = withAuth(async (req: NextRequest) => {
  try {
    const { id } = await req.json()
    const current = readStore()
    const groups = current.skillGroups.map(g => ({
      ...g,
      skills: g.skills.filter(s => s.id !== id),
    }))
    writeStore({ skillGroups: groups })
    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 500 })
  }
})
