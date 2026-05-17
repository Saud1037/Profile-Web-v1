import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from '@/lib/auth'
import { AdminLogin } from '@/components/admin/AdminLogin'

export const metadata = {
  title: 'دخول الإدارة',
  robots: { index: false, follow: false },
}

export default function AdminLoginPage() {
  const cookieStore = cookies()
  const token = cookieStore.get('admin_token')?.value
  if (token && verifyToken(token).valid) {
    redirect('/admin')
  }
  return <AdminLogin />
}
