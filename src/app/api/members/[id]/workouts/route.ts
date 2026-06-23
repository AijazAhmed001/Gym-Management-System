import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  if (session.user?.role !== 'ADMIN' && session.user?.id !== id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const logs = await prisma.workoutLog.findMany({
    where: { userId: id },
    include: { exercises: true },
    orderBy: { date: 'desc' },
    take: 30,
  })
  return NextResponse.json(logs)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  if (session.user?.role !== 'ADMIN' && session.user?.id !== id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { exercises, ...logData } = await req.json()
  const log = await prisma.workoutLog.create({
    data: {
      userId: id,
      ...logData,
      exercises: { create: exercises || [] },
    },
    include: { exercises: true },
  })
  return NextResponse.json(log, { status: 201 })
}
