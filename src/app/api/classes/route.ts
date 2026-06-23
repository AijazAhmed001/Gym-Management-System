import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const classes = await prisma.fitnessClass.findMany({
    where: { isActive: true },
    include: {
      trainer: true,
      _count: { select: { bookings: { where: { status: 'BOOKED' } } } },
    },
    orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
  })
  return NextResponse.json(classes)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json()
  const fitnessClass = await prisma.fitnessClass.create({
    data: body,
    include: { trainer: true },
  })
  return NextResponse.json(fitnessClass, { status: 201 })
}
