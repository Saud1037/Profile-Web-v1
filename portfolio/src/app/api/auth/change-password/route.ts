import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/withAuth'
import { verifyPassword, hashPassword } from '@/lib/auth'

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const { current, newPassword } = await req.json()

    const valid = await verifyPassword(current)
    if (!valid) {
      return NextResponse.json({ error: 'كلمة المرور الحالية غير صحيحة' }, { status: 401 })
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'كلمة المرور الجديدة قصيرة جداً' }, { status: 400 })
    }

    // In production you would update this in your database or environment
    // For now, we hash it and return it so the user can set it in .env.local
    const hash = await hashPassword(newPassword)
    console.log('New password hash (set in ADMIN_PASSWORD_HASH env):', hash)

    // If using Supabase, update the hash in a settings table
    // const client = createServiceClient()
    // await client.from('settings').upsert({ key: 'admin_password_hash', value: hash })

    return NextResponse.json({
      success: true,
      message: 'تم تغيير كلمة المرور. قم بتحديث ADMIN_PASSWORD_HASH في .env.local',
      hash, // Only in dev - remove in production
    })
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
})
