import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from '@/lib/auth'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export const metadata = {
  title: 'لوحة التحكم',
  robots: { index: false, follow: false },
}

export default function AdminPage() {
  const cookieStore = cookies()
  const token = cookieStore.get('admin_token')?.value

  const isAuth = token ? verifyToken(token).valid : false

  if (!isAuth) {
    redirect('/admin/login')
  }

  return <AdminDashboard />
}
