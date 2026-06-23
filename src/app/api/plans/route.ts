import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const plans = await prisma.membershipPlan.findMany({
    where: { isActive: true },
    include: { _count: { select: { subscriptions: { where: { status: 'ACTIVE' } } } } },
    orderBy: { price: 'asc' },
  })
  return NextResponse.json(plans)
}
