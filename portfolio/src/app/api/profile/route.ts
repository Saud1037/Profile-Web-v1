import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/withAuth'
import { updateProfile, getProfile } from '@/lib/data'

export async function GET() {
  const profile = await getProfile()
  return NextResponse.json(profile)
}

export const PUT = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json()
    await updateProfile(body)
    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'خطأ'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
})
