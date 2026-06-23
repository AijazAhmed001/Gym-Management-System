import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  if (session.user?.role !== 'ADMIN' && session.user?.id !== id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const member = await prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
      subscription: { include: { plan: true } },
      bookings: { include: { class: { include: { trainer: true } } }, orderBy: { bookedAt: 'desc' }, take: 10 },
      payments: { orderBy: { createdAt: 'desc' }, take: 10 },
      _count: { select: { bookings: true, workoutLogs: true, progressLogs: true } },
    },
  })
  if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(member)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  if (session.user?.role !== 'ADMIN' && session.user?.id !== id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const body = await req.json()
  const { profile, ...userData } = body
  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...userData,
      ...(profile && {
        profile: { upsert: { create: profile, update: profile } },
      }),
    },
    include: { profile: true },
  })
  return NextResponse.json(updated)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
