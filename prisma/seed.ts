import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  await prisma.notification.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.progressEntry.deleteMany()
  await prisma.workoutExercise.deleteMany()
  await prisma.workoutLog.deleteMany()
  await prisma.classBooking.deleteMany()
  await prisma.fitnessClass.deleteMany()
  await prisma.trainer.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.membershipPlan.deleteMany()
  await prisma.memberProfile.deleteMany()
  await prisma.user.deleteMany()

  // ── Plans ────────────────────────────────────────────────────────────────
  const basicPlan = await prisma.membershipPlan.create({
    data: {
      name: 'Basic', description: 'Perfect for getting started', price: 29,
      features: JSON.stringify(['Access to gym floor','2 group classes/month','Locker room access','Basic workout tracking']),
    },
  })
  const proPlan = await prisma.membershipPlan.create({
    data: {
      name: 'Pro', description: 'Most popular for serious athletes', price: 59,
      features: JSON.stringify(['Unlimited gym access','10 group classes/month','Locker room access','Full workout tracking','Progress analytics','1 trainer consultation/month']),
    },
  })
  const elitePlan = await prisma.membershipPlan.create({
    data: {
      name: 'Elite', description: 'The ultimate fitness experience', price: 99,
      features: JSON.stringify(['Unlimited gym access','Unlimited group classes','Private locker','Full workout & progress tracking','Weekly trainer sessions','Nutrition planning','Guest passes (2/month)']),
    },
  })

  // ── Admin ────────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123', 12)
  await prisma.user.create({
    data: { email: 'admin@ironpeak.com', password: adminPassword, name: 'Alex Morrison', role: 'ADMIN', phone: '+1-555-0100' },
  })

  // ── Trainers ─────────────────────────────────────────────────────────────
  const t1 = await prisma.trainer.create({ data: { name: 'Marcus Steel', email: 'marcus@ironpeak.com', bio: 'Former competitive powerlifter with 12 years of coaching. Specializes in strength and body recomposition.', specializations: JSON.stringify(['Powerlifting','Strength Training','Body Recomposition']), certifications: JSON.stringify(['NSCA-CSCS','NASM-CPT']), experience: 12 } })
  const t2 = await prisma.trainer.create({ data: { name: 'Sofia Rivera', email: 'sofia@ironpeak.com', bio: 'Certified yoga instructor and mindfulness coach with a sports science background.', specializations: JSON.stringify(['Yoga','Pilates','Mindfulness','Flexibility']), certifications: JSON.stringify(['RYT-500','AFAA Group Fitness']), experience: 8 } })
  const t3 = await prisma.trainer.create({ data: { name: 'Darius Chen', email: 'darius@ironpeak.com', bio: 'HIIT specialist and former sprinter. Expert in metabolic conditioning and athletic performance.', specializations: JSON.stringify(['HIIT','Cardio','Athletic Performance']), certifications: JSON.stringify(['NASM-CPT','CrossFit Level 2']), experience: 6 } })
  const t4 = await prisma.trainer.create({ data: { name: 'Priya Patel', email: 'priya@ironpeak.com', bio: 'Nutrition-certified trainer specializing in weight management and functional movement.', specializations: JSON.stringify(['Nutrition','Weight Loss','Functional Training']), certifications: JSON.stringify(['ACE-CPT','Precision Nutrition Level 1']), experience: 9 } })
  const t5 = await prisma.trainer.create({ data: { name: 'Jake Thompson', email: 'jake@ironpeak.com', bio: 'Olympic lifting coach and strength & conditioning specialist.', specializations: JSON.stringify(['Olympic Lifting','Strength & Conditioning','Plyometrics']), certifications: JSON.stringify(['USAW Level 2','NSCA-CSCS']), experience: 10 } })

  // ── Classes ───────────────────────────────────────────────────────────────
  await prisma.fitnessClass.createMany({
    data: [
      { name: 'Morning HIIT Blast',    description: 'High-intensity interval training to kick-start your metabolism.', trainerId: t3.id, dayOfWeek: 1, startTime: '06:00', endTime: '07:00', capacity: 20, classType: 'HIIT',       location: 'Studio A'   },
      { name: 'Power Yoga Flow',        description: 'Dynamic yoga linking breath with movement for strength and flexibility.', trainerId: t2.id, dayOfWeek: 1, startTime: '09:00', endTime: '10:00', capacity: 15, classType: 'Yoga',       location: 'Yoga Studio'},
      { name: 'Olympic Lifting Clinic', description: 'Learn the snatch and clean & jerk from the ground up.', trainerId: t5.id, dayOfWeek: 2, startTime: '07:00', endTime: '08:30', capacity: 10, classType: 'Strength',    location: 'Weight Room'},
      { name: 'Cardio Burn',            description: 'High-energy cardio session for maximum calorie burn.', trainerId: t3.id, dayOfWeek: 2, startTime: '18:00', endTime: '19:00', capacity: 25, classType: 'Cardio',      location: 'Studio B'   },
      { name: 'Strength Fundamentals',  description: 'Master compound lifts: squat, bench, deadlift.', trainerId: t1.id, dayOfWeek: 3, startTime: '06:30', endTime: '07:30', capacity: 12, classType: 'Strength',    location: 'Weight Room'},
      { name: 'Pilates Core',           description: 'Build a rock-solid core through Pilates principles.', trainerId: t2.id, dayOfWeek: 3, startTime: '10:00', endTime: '11:00', capacity: 15, classType: 'Pilates',     location: 'Yoga Studio'},
      { name: 'Functional Fitness',     description: 'Movement patterns for everyday life — scalable for all levels.', trainerId: t4.id, dayOfWeek: 4, startTime: '07:00', endTime: '08:00', capacity: 18, classType: 'Functional',  location: 'Studio A'   },
      { name: 'Evening HIIT',           description: 'Sweat it out after work with this high-energy HIIT session.', trainerId: t3.id, dayOfWeek: 4, startTime: '19:00', endTime: '20:00', capacity: 20, classType: 'HIIT',       location: 'Studio B'   },
      { name: 'Powerlifting Club',      description: 'Compete-ready strength training with structured programming.', trainerId: t1.id, dayOfWeek: 5, startTime: '06:00', endTime: '07:30', capacity: 10, classType: 'Strength',    location: 'Weight Room'},
      { name: 'Restorative Yoga',       description: 'Deep stretching and recovery for tired muscles.', trainerId: t2.id, dayOfWeek: 5, startTime: '18:30', endTime: '19:30', capacity: 20, classType: 'Yoga',       location: 'Yoga Studio'},
      { name: 'Saturday Sweat',         description: 'Weekend warrior full-body circuit training.', trainerId: t4.id, dayOfWeek: 6, startTime: '08:00', endTime: '09:00', capacity: 25, classType: 'Circuit',     location: 'Studio A'   },
      { name: 'Olympic Prep',           description: 'Advanced Olympic lifting for experienced athletes.', trainerId: t5.id, dayOfWeek: 6, startTime: '10:00', endTime: '11:30', capacity: 8,  classType: 'Strength',    location: 'Weight Room'},
    ],
  })

  // ── Members ────────────────────────────────────────────────────────────────
  const memberPassword = await bcrypt.hash('member123', 12)

  const m1 = await prisma.user.create({
    data: {
      email: 'john.doe@email.com', password: memberPassword, name: 'John Doe', role: 'MEMBER', phone: '+1-555-0301', gender: 'Male',
      profile: { create: { fitnessGoal: 'Build muscle and increase strength', fitnessLevel: 'INTERMEDIATE', emergencyName: 'Jane Doe', emergencyPhone: '+1-555-0302', emergencyRelation: 'Spouse' } },
      subscription: { create: { planId: proPlan.id, status: 'ACTIVE', startDate: new Date('2024-01-01') } },
    },
  })
  const m2 = await prisma.user.create({
    data: {
      email: 'sarah.jones@email.com', password: memberPassword, name: 'Sarah Jones', role: 'MEMBER', phone: '+1-555-0303', gender: 'Female',
      profile: { create: { fitnessGoal: 'Lose weight and improve cardio', fitnessLevel: 'BEGINNER' } },
      subscription: { create: { planId: basicPlan.id, status: 'ACTIVE', startDate: new Date('2024-02-15') } },
    },
  })
  await prisma.user.create({
    data: {
      email: 'mike.chen@email.com', password: memberPassword, name: 'Mike Chen', role: 'MEMBER', phone: '+1-555-0305', gender: 'Male',
      profile: { create: { fitnessGoal: 'Train for Olympic lifting competition', fitnessLevel: 'ADVANCED' } },
      subscription: { create: { planId: elitePlan.id, status: 'ACTIVE', startDate: new Date('2023-11-01') } },
    },
  })

  // ── Progress entries ──────────────────────────────────────────────────────
  const now = new Date()
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now); d.setMonth(d.getMonth() - i)
    await prisma.progressEntry.create({ data: { userId: m1.id, date: d, weight: +(88 - i * 0.4 + Math.random() * 0.5).toFixed(1), bodyFat: +(22 - i * 0.3).toFixed(1), chest: +(100 + i * 0.1).toFixed(1), waist: +(90 - i * 0.4).toFixed(1) } })
  }

  // ── Workouts ──────────────────────────────────────────────────────────────
  const workoutNames = ['Push Day','Pull Day','Leg Day','Upper Body','Full Body','Cardio','Arms']
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now); d.setDate(d.getDate() - i * 2)
    await prisma.workoutLog.create({
      data: {
        userId: m1.id, date: d, title: workoutNames[i], duration: 60 + Math.floor(Math.random() * 30),
        exercises: { create: [
          { name: 'Bench Press', sets: 4, reps: 8, weight: 80 + i * 2.5 },
          { name: 'Squat',       sets: 5, reps: 5, weight: 100 + i * 5 },
          { name: 'Deadlift',    sets: 3, reps: 5, weight: 120 + i * 5 },
        ]},
      },
    })
  }

  // ── Payments ──────────────────────────────────────────────────────────────
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now); d.setMonth(d.getMonth() - i)
    await prisma.payment.create({ data: { userId: m1.id, amount: 59, status: 'succeeded', description: 'Pro Plan - Monthly', createdAt: d } })
  }
  for (let i = 3; i >= 0; i--) {
    const d = new Date(now); d.setMonth(d.getMonth() - i)
    await prisma.payment.create({ data: { userId: m2.id, amount: 29, status: 'succeeded', description: 'Basic Plan - Monthly', createdAt: d } })
  }

  // ── Notifications ─────────────────────────────────────────────────────────
  await prisma.notification.createMany({
    data: [
      { userId: m1.id, title: 'Welcome to IronPeak! 🎉', message: 'Your membership is now active. Start booking classes today!', type: 'SUCCESS' },
      { userId: m1.id, title: 'Class Reminder', message: 'Morning HIIT Blast starts in 1 hour. Get ready!', type: 'INFO' },
      { userId: m1.id, title: 'New Class Available', message: 'Olympic Prep class added on Saturdays at 10:00 AM.', type: 'INFO', isRead: true },
      { userId: m2.id, title: 'Welcome to IronPeak! 🎉', message: 'Your membership is now active. Start booking classes today!', type: 'SUCCESS' },
      { userId: m2.id, title: 'Upgrade Your Plan', message: 'Unlock unlimited classes with our Pro plan. Upgrade today!', type: 'INFO' },
    ],
  })

  console.log('✅ Database seeded successfully!')
  console.log('')
  console.log('👤 Demo Accounts:')
  console.log('   Admin:  admin@ironpeak.com    / admin123')
  console.log('   Member: john.doe@email.com    / member123')
  console.log('   Member: sarah.jones@email.com / member123')
  console.log('   Member: mike.chen@email.com   / member123')
}

main().catch(e => { console.error('Seed error:', e); process.exit(1) }).finally(() => prisma.$disconnect())
