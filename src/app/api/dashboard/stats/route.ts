import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const [totalMembers, activeSubscriptions, monthlyRevenue, classesToday, totalRevenue] = await Promise.all([
    prisma.user.count({ where: { role: 'MEMBER' } }),
    prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'succeeded', createdAt: { gte: startOfMonth } } }),
    prisma.classBooking.count({ where: { classDate: { gte: todayStart, lt: new Date(todayStart.getTime() + 86400000) } } }),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'succeeded' } }),
  ])

  // Revenue over last 12 months
  const revenueData = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
    const result = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: 'succeeded', createdAt: { gte: d, lt: end } },
    })
    revenueData.push({
      month: d.toLocaleString('default', { month: 'short', year: '2-digit' }),
      revenue: result._sum.amount || 0,
    })
  }

  // Member growth over last 12 months
  const memberGrowth = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
    const count = await prisma.user.count({ where: { role: 'MEMBER', createdAt: { lt: d } } })
    memberGrowth.push({
      month: new Date(now.getFullYear(), now.getMonth() - i, 1).toLocaleString('default', { month: 'short', year: '2-digit' }),
      members: count,
    })
  }

  // Top classes
  const topClasses = await prisma.fitnessClass.findMany({
    include: { _count: { select: { bookings: true } } },
    orderBy: { bookings: { _count: 'desc' } },
    take: 5,
  })

  // Plan distribution
  const planDist = await prisma.subscription.groupBy({
    by: ['planId'],
    _count: true,
    where: { status: 'ACTIVE' },
  })
  const planNames = await prisma.membershipPlan.findMany({ select: { id: true, name: true } })

  return NextResponse.json({
    kpis: {
      totalMembers,
      activeSubscriptions,
      monthlyRevenue: monthlyRevenue._sum.amount || 0,
      classesToday,
      totalRevenue: totalRevenue._sum.amount || 0,
    },
    revenueData,
    memberGrowth,
    topClasses: topClasses.map(c => ({ name: c.name, bookings: c._count.bookings })),
    planDistribution: planDist.map(p => ({
      name: planNames.find(n => n.id === p.planId)?.name || 'Unknown',
      count: p._count,
    })),
  })
}
