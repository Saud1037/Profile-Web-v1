import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/withAuth'
import { getStoreTheme, readStore, writeStore } from '@/lib/store'

export async function GET() {
  return NextResponse.json(getStoreTheme())
}

export const PUT = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json()
    const current = readStore()
    writeStore({ theme: { ...current.theme, ...body } })
    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 500 })
  }
})
