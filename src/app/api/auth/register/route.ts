import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone, planId } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered.' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        phone,
        role: 'MEMBER',
        profile: { create: {} },
        ...(planId && {
          subscription: {
            create: {
              planId,
              status: 'ACTIVE',
            },
          },
        }),
      },
      select: { id: true, email: true, name: true, role: true },
    })

    // Welcome notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Welcome to IronPeak Fitness! 🎉',
        message: 'Your account is now active. Start exploring classes and book your first session!',
        type: 'SUCCESS',
      },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
