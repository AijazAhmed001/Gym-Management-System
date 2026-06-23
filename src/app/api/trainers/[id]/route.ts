import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const trainer = await prisma.trainer.findUnique({
    where: { id },
    include: { classes: { where: { isActive: true } } },
  })
  if (!trainer) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(trainer)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const trainer = await prisma.trainer.update({ where: { id }, data: body })
  return NextResponse.json(trainer)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await prisma.trainer.update({ where: { id }, data: { isActive: false } })
  return NextResponse.json({ success: true })
}
