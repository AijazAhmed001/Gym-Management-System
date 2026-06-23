import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

const navItems = [
  { href: '/dashboard',         label: 'Dashboard',        icon: '🏠' },
  { href: '/classes',           label: 'Browse Classes',   icon: '🗓️' },
  { href: '/bookings',          label: 'My Bookings',      icon: '📋' },
  { href: '/workouts/planner',  label: 'Workout Planner',  icon: '📆' },
  { href: '/workouts',          label: 'Workout Log',      icon: '💪' },
  { href: '/progress',          label: 'Progress Tracker', icon: '📈' },
  { href: '/billing',           label: 'Membership',       icon: '💳' },
]

const bottomItems = [
  { href: '/profile', label: 'Profile & Settings', icon: '👤' },
]

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="app-layout">
      <Sidebar
        user={{ name: session.user?.name, email: session.user?.email, role: session.user?.role || 'MEMBER' }}
        navItems={navItems}
        bottomItems={bottomItems}
      />
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}
