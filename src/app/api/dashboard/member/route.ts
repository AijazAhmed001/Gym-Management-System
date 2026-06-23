import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = session.user.id

  // Bookings for the member
  const bookings = await prisma.classBooking.findMany({
    where: { userId, status: 'BOOKED', classDate: { gte: new Date() } },
    include: { class: { include: { trainer: true } } },
    orderBy: { classDate: 'asc' },
    take: 5,
  })

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    include: { plan: true },
  })

  const workoutCount = await prisma.workoutLog.count({
    where: { userId, date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
  })

  const notifications = await prisma.notification.findMany({
    where: { userId, isRead: false },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  return NextResponse.json({ bookings, subscription, workoutCount, notifications })
}
