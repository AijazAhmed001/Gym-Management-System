import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

const navItems = [
  { href: '/admin', label: 'Overview', icon: '📊' },
  { href: '/admin/members', label: 'Members', icon: '👥' },
  { href: '/admin/classes', label: 'Classes', icon: '🗓️' },
  { href: '/admin/trainers', label: 'Trainers', icon: '🏋️' },
  { href: '/admin/attendance', label: 'Attendance', icon: '📋' },
  { href: '/admin/plans', label: 'Plans', icon: '💎' },
]

const bottomItems = [
  { href: '/admin/reports', label: 'Reports', icon: '📈' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || session.user?.role !== 'ADMIN') redirect('/login')

  return (
    <div className="app-layout">
      <Sidebar
        user={{ name: session.user?.name, email: session.user?.email, role: 'ADMIN' }}
        navItems={navItems}
        bottomItems={bottomItems}
      />
      <main className="main-content">{children}</main>
    </div>
  )
}
