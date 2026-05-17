import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/withAuth'
import { verifyPassword, hashPassword } from '@/lib/auth'

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const { current, newPassword } = await req.json()
    const valid = await verifyPassword(current)
    if (!valid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
    if (!newPassword || newPassword.length < 6) return NextResponse.json({ error: 'New password too short (min 6 chars)' }, { status: 400 })
    const hash = await hashPassword(newPassword)
    // Log the hash — user sets it in .env.local as ADMIN_PASSWORD_HASH
    console.log('✅ New ADMIN_PASSWORD_HASH:', hash)
    return NextResponse.json({ success: true, hint: 'Set ADMIN_PASSWORD_HASH=' + hash + ' in .env.local' })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
})
