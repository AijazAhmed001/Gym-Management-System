import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id: classId } = await params
  const { classDate } = await req.json()
  const userId = session.user.id

  const cls = await prisma.fitnessClass.findUnique({
    where: { id: classId },
    include: { _count: { select: { bookings: { where: { status: 'BOOKED', classDate: new Date(classDate) } } } } },
  })
  if (!cls) return NextResponse.json({ error: 'Class not found' }, { status: 404 })
  if (cls._count.bookings >= cls.capacity) return NextResponse.json({ error: 'Class is full' }, { status: 409 })

  const existing = await prisma.classBooking.findUnique({
    where: { userId_classId_classDate: { userId, classId, classDate: new Date(classDate) } },
  })
  if (existing && existing.status === 'BOOKED') return NextResponse.json({ error: 'Already booked' }, { status: 409 })

  const booking = existing
    ? await prisma.classBooking.update({ where: { id: existing.id }, data: { status: 'BOOKED' } })
    : await prisma.classBooking.create({ data: { userId, classId, classDate: new Date(classDate), status: 'BOOKED' } })

  await prisma.notification.create({
    data: { userId, title: 'Class Booked ✅', message: `You've booked ${cls.name} on ${new Date(classDate).toDateString()}.`, type: 'SUCCESS' },
  })

  return NextResponse.json(booking, { status: 201 })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id: classId } = await params
  const { classDate } = await req.json()
  const userId = session.user.id

  await prisma.classBooking.updateMany({
    where: { userId, classId, classDate: new Date(classDate) },
    data: { status: 'CANCELLED' },
  })
  return NextResponse.json({ success: true })
}
