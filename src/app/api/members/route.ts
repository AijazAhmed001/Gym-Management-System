import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const members = await prisma.user.findMany({
    where: {
      role: 'MEMBER',
      OR: [
        { name: { contains: search } },
        { email: { contains: search } },
      ],
    },
    include: {
      subscription: { include: { plan: true } },
      _count: { select: { bookings: true, workoutLogs: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(members)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json()
  const bcrypt = (await import('bcryptjs')).default
  const hashed = await bcrypt.hash(body.password || 'Welcome123!', 12)
  const member = await prisma.user.create({
    data: {
      ...body,
      password: hashed,
      role: 'MEMBER',
      profile: { create: {} },
    },
  })
  return NextResponse.json(member, { status: 201 })
}
