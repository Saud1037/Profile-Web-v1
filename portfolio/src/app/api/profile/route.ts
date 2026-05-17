import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/withAuth'
import { getStoreProfile, writeStore, readStore } from '@/lib/store'

export async function GET() {
  try {
    return NextResponse.json(getStoreProfile())
  } catch {
    return NextResponse.json({ error: 'Failed to read profile' }, { status: 500 })
  }
}

export const PUT = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json()
    const current = readStore()
    writeStore({ profile: { ...current.profile, ...body, id: '1' } })
    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
})
