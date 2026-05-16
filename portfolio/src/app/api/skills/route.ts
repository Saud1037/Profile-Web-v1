import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/withAuth'
import { getSkillGroups, upsertSkillGroup, upsertSkill, deleteSkill } from '@/lib/data'

export async function GET() {
  const groups = await getSkillGroups()
  return NextResponse.json(groups)
}

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json()
    if (body.type === 'group') {
      const group = await upsertSkillGroup(body.data)
      return NextResponse.json(group)
    } else {
      await upsertSkill(body.data)
      return NextResponse.json({ success: true })
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'خطأ'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
})

export const DELETE = withAuth(async (req: NextRequest) => {
  try {
    const { id } = await req.json()
    await deleteSkill(id)
    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'خطأ'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
})
