import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { planId, mock = true } = await req.json()
  const userId = session.user.id

  const plan = await prisma.membershipPlan.findUnique({ where: { id: planId } })
  if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 })

  // Mock payment record
  const payment = await prisma.payment.create({
    data: {
      userId,
      amount: plan.price,
      status: 'succeeded',
      description: `${plan.name} Plan - Monthly`,
      stripeChargeId: mock ? `mock_${Date.now()}` : undefined,
    },
  })

  // Upsert subscription
  const subscription = await prisma.subscription.upsert({
    where: { userId },
    update: { planId, status: 'ACTIVE', startDate: new Date(), endDate: null },
    create: { userId, planId, status: 'ACTIVE' },
    include: { plan: true },
  })

  await prisma.notification.create({
    data: {
      userId,
      title: 'Subscription Updated 🎉',
      message: `You're now on the ${plan.name} plan. Enjoy your membership!`,
      type: 'SUCCESS',
    },
  })

  return NextResponse.json({ subscription, payment }, { status: 201 })
}
