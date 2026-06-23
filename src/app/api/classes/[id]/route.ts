import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cls = await prisma.fitnessClass.findUnique({
    where: { id },
    include: {
      trainer: true,
      bookings: { include: { user: { select: { id: true, name: true, email: true } } } },
    },
  })
  if (!cls) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(cls)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const cls = await prisma.fitnessClass.update({ where: { id }, data: body, include: { trainer: true } })
  return NextResponse.json(cls)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await prisma.fitnessClass.update({ where: { id }, data: { isActive: false } })
  return NextResponse.json({ success: true })
}
