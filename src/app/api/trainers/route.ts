import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const trainers = await prisma.trainer.findMany({
    where: { isActive: true },
    include: { _count: { select: { classes: true } } },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(trainers)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json()
  const trainer = await prisma.trainer.create({ data: body })
  return NextResponse.json(trainer, { status: 201 })
}
