import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// GET /api/members/[id]/progress
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  if (session.user?.role !== 'ADMIN' && session.user?.id !== id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const entries = await prisma.progressEntry.findMany({
    where: { userId: id },
    orderBy: { date: 'asc' },
  })
  return NextResponse.json(entries)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  if (session.user?.role !== 'ADMIN' && session.user?.id !== id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const entry = await prisma.progressEntry.create({ data: { userId: id, ...body } })
  return NextResponse.json(entry, { status: 201 })
}
