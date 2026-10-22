import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Checking IRON REVOLUTION Database Initialization...');

  const userCount = await prisma.user.count().catch(() => 0);
  if (userCount > 0) {
    console.log('✅ Database already initialized with data. Skipping re-seed.');
    return;
  }

  console.log('🌱 Populating IRON REVOLUTION Database with Real Naroli Gym Information...');

  // Clean tables
  await prisma.attendance.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.workoutExercise.deleteMany();
  await prisma.workoutPlan.deleteMany();
  await prisma.workoutClass.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.memberProfile.deleteMany();
  await prisma.trainerProfile.deleteMany();
  await prisma.membershipPlan.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.gymSetting.deleteMany();
  await prisma.user.deleteMany();

  // Passwords
  const adminHash = await bcrypt.hash('Admin@123', 10);
  const trainerHash = await bcrypt.hash('Trainer@123', 10);
  const memberHash = await bcrypt.hash('Member@123', 10);

  // 1. Official Gym Settings (From @ironrevolution_2.0 Instagram)
  await prisma.gymSetting.create({
    data: {
      id: 'default-gym-settings',
      gymName: 'IRON REVOLUTION 2.0',
      ownerName: 'Sachin Patel',
      developerName: 'Apurva Mishra',
      locationAddress: 'Near Primary School, Naroli Road, Naroli, Silvassa, Dadra & Nagar Haveli — 396235',
      phone: '+91 87349 22441 / +91 91042 31111',
      email: 'ironrevolution2.0@gmail.com',
      openingHours: 'Mon - Sat: 5:00 AM - 10:00 AM & 5:00 PM - 10:00 PM | Sunday: 5:00 PM - 9:00 PM',
      announcement: 'Welcome to IRON REVOLUTION 2.0 Naroli! State-of-the-art gym with certified personal trainers and modern workout equipment.',
    },
  });

  // 2. Membership Plans (Clear & Simple Indian English)
  const planMonthly = await prisma.membershipPlan.create({
    data: {
      name: '1 Month Membership',
      description: 'Monthly gym access for beginners and regular workouts.',
      durationMonths: 1,
      price: 999,
      benefits: JSON.stringify([
        'Full gym floor & cardio workout access',
        'Locker room and changing room facility',
        'Basic workout chart & trainer guidance',
        'Daily entry check-in system',
      ]),
      isActive: true,
    },
  });

  const planQuarterly = await prisma.membershipPlan.create({
    data: {
      name: '3 Months (Quarterly)',
      description: 'Popular 3-month package for body transformation and fitness.',
      durationMonths: 3,
      price: 2499,
      benefits: JSON.stringify([
        'All 1-Month plan benefits included',
        'Diet and nutrition guidance by coach',
        'Free body fat & weight checkup every month',
        'Steam bath and recovery room access',
      ]),
      isActive: true,
    },
  });

  const planHalfYearly = await prisma.membershipPlan.create({
    data: {
      name: '6 Months (Half-Yearly)',
      description: 'Great value 6-month plan for serious bodybuilding and weight loss.',
      durationMonths: 6,
      price: 4499,
      benefits: JSON.stringify([
        'All 3-Month plan benefits included',
        'Personal workout schedule for each muscle group',
        'Regular progress tracking by trainers',
        'Priority batch slot booking',
      ]),
      isActive: true,
    },
  });

  const planAnnual = await prisma.membershipPlan.create({
    data: {
      name: '1 Year (Annual VIP)',
      description: 'Full year membership with best savings and complete personal guidance.',
      durationMonths: 12,
      price: 7999,
      benefits: JSON.stringify([
        'Unlimited morning and evening entry all 365 days',
        'Personal fitness mentoring by Sachin Patel & team',
        'Complimentary Iron Revolution gym T-shirt & shaker',
        'Free workout and protein diet consultation',
        '2 Free guest passes every month for friends',
      ]),
      isActive: true,
    },
  });

  // 3. Admin Account
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@ironrevolution.com',
      passwordHash: adminHash,
      role: 'ADMIN',
    },
  });

  // 4. Mentors as requested: Sachin Patel (with photo), Akshay Patel, Krutika Patel
  // Sachin Patel (Head Coach & Founder - with user's uploaded photo)
  const trainer1User = await prisma.user.create({
    data: {
      email: 'trainer@ironrevolution.com',
      passwordHash: trainerHash,
      role: 'TRAINER',
      trainerProfile: {
        create: {
          trainerId: 'IR-TRN-101',
          fullName: 'Sachin Patel',
          phone: '+91 87349 22441',
          specialization: 'Bodybuilding, Muscle Building & Head Mentor',
          experienceYears: 8,
          bio: 'Founder and Head Coach at Iron Revolution. Certified fitness expert specializing in bodybuilding, heavy barbell strength training, and complete body transformation.',
          photoUrl: '/assets/mentor-sachin.jpg', // User uploaded image!
          status: 'ACTIVE',
        },
      },
    },
    include: { trainerProfile: true },
  });

  // Akshay Patel (Co-Founder & Senior Coach)
  const trainer2User = await prisma.user.create({
    data: {
      email: 'akshay.patel@ironrevolution.com',
      passwordHash: trainerHash,
      role: 'TRAINER',
      trainerProfile: {
        create: {
          trainerId: 'IR-TRN-102',
          fullName: 'Akshay Patel',
          phone: '+91 91042 31111',
          specialization: 'Strength Training, CrossFit & Weight Loss',
          experienceYears: 6,
          bio: 'Senior Strength Coach at Iron Revolution. Expert in functional fitness, high-intensity fat burning, and posture correction.',
          photoUrl: null, // "only info for other info"
          status: 'ACTIVE',
        },
      },
    },
    include: { trainerProfile: true },
  });

  // Krutika Patel (Fitness & Nutrition Coach)
  const trainer3User = await prisma.user.create({
    data: {
      email: 'krutika.patel@ironrevolution.com',
      passwordHash: trainerHash,
      role: 'TRAINER',
      trainerProfile: {
        create: {
          trainerId: 'IR-TRN-103',
          fullName: 'Krutika Patel',
          phone: '+91 87349 22441',
          specialization: 'Nutritionist, HIIT & Women Fitness Coach',
          experienceYears: 5,
          bio: 'Certified Nutrition and Lifestyle Coach. Specializes in customized Indian home diet planning, stamina building, and female body toning.',
          photoUrl: null, // "only info for other info"
          status: 'ACTIVE',
        },
      },
    },
    include: { trainerProfile: true },
  });

  const trainer1 = trainer1User.trainerProfile!;
  const trainer2 = trainer2User.trainerProfile!;
  const trainer3 = trainer3User.trainerProfile!;

  // 5. Members
  const now = new Date();
  const nextYear = new Date();
  nextYear.setFullYear(now.getFullYear() + 1);

  // Apurva Mishra (Developer & Member)
  const member1User = await prisma.user.create({
    data: {
      email: 'member@ironrevolution.com',
      passwordHash: memberHash,
      role: 'MEMBER',
      memberProfile: {
        create: {
          memberId: 'IR-MEM-1001',
          fullName: 'Apurva Mishra',
          phone: '+91 98980 12345',
          dateOfBirth: '2003-05-14',
          gender: 'Male',
          address: 'Naroli Road, Silvassa, Dadra & Nagar Haveli',
          emergencyContact: '+91 87349 22441',
          status: 'ACTIVE',
          membershipPlanId: planAnnual.id,
          assignedTrainerId: trainer1.id, // Trained by Sachin Patel
          membershipStartDate: now,
          membershipExpiryDate: nextYear,
        },
      },
    },
    include: { memberProfile: true },
  });

  // Member 2
  const next3Months = new Date();
  next3Months.setMonth(now.getMonth() + 3);
  const member2User = await prisma.user.create({
    data: {
      email: 'rohan.deshmukh@example.com',
      passwordHash: memberHash,
      role: 'MEMBER',
      memberProfile: {
        create: {
          memberId: 'IR-MEM-1002',
          fullName: 'Rohan Deshmukh',
          phone: '+91 98791 22334',
          dateOfBirth: '1998-11-20',
          gender: 'Male',
          address: 'Near Primary School, Naroli, Silvassa',
          emergencyContact: '+91 98791 88776',
          status: 'ACTIVE',
          membershipPlanId: planQuarterly.id,
          assignedTrainerId: trainer2.id,
          membershipStartDate: now,
          membershipExpiryDate: next3Months,
        },
      },
    },
    include: { memberProfile: true },
  });

  // Member 3
  const nextMonth = new Date();
  nextMonth.setMonth(now.getMonth() + 1);
  const member3User = await prisma.user.create({
    data: {
      email: 'ananya.roy@example.com',
      passwordHash: memberHash,
      role: 'MEMBER',
      memberProfile: {
        create: {
          memberId: 'IR-MEM-1003',
          fullName: 'Ananya Roy',
          phone: '+91 98241 55667',
          dateOfBirth: '2001-08-09',
          gender: 'Female',
          address: 'Vapi-Silvassa Road, Silvassa',
          emergencyContact: '+91 98241 11223',
          status: 'ACTIVE',
          membershipPlanId: planMonthly.id,
          assignedTrainerId: trainer3.id,
          membershipStartDate: now,
          membershipExpiryDate: nextMonth,
        },
      },
    },
    include: { memberProfile: true },
  });

  // Member 4 - Expiring soon (3 days)
  const expiringDate = new Date();
  expiringDate.setDate(now.getDate() + 3);
  await prisma.user.create({
    data: {
      email: 'kunal.verma@example.com',
      passwordHash: memberHash,
      role: 'MEMBER',
      memberProfile: {
        create: {
          memberId: 'IR-MEM-1004',
          fullName: 'Kunal Verma',
          phone: '+91 97230 77889',
          dateOfBirth: '1995-03-25',
          gender: 'Male',
          address: 'Naroli Char Rasta, Silvassa',
          status: 'ACTIVE',
          membershipPlanId: planMonthly.id,
          assignedTrainerId: trainer1.id,
          membershipStartDate: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
          membershipExpiryDate: expiringDate,
        },
      },
    },
  });

  // Member 5 - Pending approval
  await prisma.user.create({
    data: {
      email: 'sneha.patel@example.com',
      passwordHash: memberHash,
      role: 'MEMBER',
      memberProfile: {
        create: {
          memberId: 'IR-MEM-1005',
          fullName: 'Sneha Patel',
          phone: '+91 99042 33445',
          dateOfBirth: '2000-12-10',
          gender: 'Female',
          address: 'Naroli, Silvassa',
          status: 'PENDING',
          membershipPlanId: planHalfYearly.id,
        },
      },
    },
  });

  const m1 = member1User.memberProfile!;
  const m2 = member2User.memberProfile!;
  const m3 = member3User.memberProfile!;

  // 6. Timetable Classes (Simple Indian English batch timings)
  await prisma.workoutClass.createMany({
    data: [
      {
        title: 'Morning Strength & Heavy Lifting',
        trainerProfileId: trainer1.id,
        dayOfWeek: 'Monday',
        startTime: '06:00 AM',
        endTime: '07:15 AM',
        maxSlots: 15,
        roomOrArea: 'Main Barbell Floor',
        description: 'Bench press, squats, and deadlifts training with Coach Sachin Patel.',
      },
      {
        title: 'CrossFit & Fat Burning Circuit',
        trainerProfileId: trainer2.id,
        dayOfWeek: 'Tuesday',
        startTime: '06:30 AM',
        endTime: '07:30 AM',
        maxSlots: 20,
        roomOrArea: 'Cardio & Turf Area',
        description: 'Fast-paced workout with battle ropes, kettlebells, and bodyweight exercises.',
      },
      {
        title: 'Evening Weight Loss & Stamina Batch',
        trainerProfileId: trainer3.id,
        dayOfWeek: 'Wednesday',
        startTime: '06:00 PM',
        endTime: '07:00 PM',
        maxSlots: 25,
        roomOrArea: 'Fitness Floor',
        description: 'Full body fat burning workout and core training with Coach Krutika.',
      },
      {
        title: 'Chest & Arms Power Workout',
        trainerProfileId: trainer1.id,
        dayOfWeek: 'Thursday',
        startTime: '07:00 AM',
        endTime: '08:15 AM',
        maxSlots: 15,
        roomOrArea: 'Free Weights Deck',
        description: 'Dumbbell press, bicep curls, and tricep pushdowns with proper form.',
      },
      {
        title: 'Leg Day & Mobility Session',
        trainerProfileId: trainer2.id,
        dayOfWeek: 'Friday',
        startTime: '06:30 PM',
        endTime: '07:30 PM',
        maxSlots: 20,
        roomOrArea: 'Main Floor',
        description: 'Squats, lunges, leg press, and stretching to avoid knee pain and injuries.',
      },
    ],
  });

  // 7. Workout Plan for Apurva Mishra
  await prisma.workoutPlan.create({
    data: {
      title: 'Muscle Building & Strength Plan (Coach Sachin Patel)',
      memberProfileId: m1.id,
      trainerProfileId: trainer1.id,
      notes: 'Take 1.5 minutes rest between sets. Drink plenty of water and eat healthy high-protein home food.',
      exercises: {
        create: [
          {
            exerciseName: 'Flat Barbell Bench Press',
            dayOfWeek: 'Monday',
            targetMuscle: 'Chest',
            sets: 4,
            reps: '8-10',
            weight: '75 kg',
            restSeconds: 90,
            order: 1,
          },
          {
            exerciseName: 'Incline Dumbbell Press',
            dayOfWeek: 'Monday',
            targetMuscle: 'Upper Chest',
            sets: 3,
            reps: '10-12',
            weight: '24 kg',
            restSeconds: 60,
            order: 2,
          },
          {
            exerciseName: 'Barbell Squats',
            dayOfWeek: 'Tuesday',
            targetMuscle: 'Legs / Thighs',
            sets: 4,
            reps: '8-10',
            weight: '90 kg',
            restSeconds: 120,
            order: 3,
          },
          {
            exerciseName: 'Standing Bicep Barbell Curls',
            dayOfWeek: 'Thursday',
            targetMuscle: 'Biceps / Arms',
            sets: 4,
            reps: '12',
            weight: '30 kg',
            restSeconds: 60,
            order: 4,
          },
          {
            exerciseName: 'Lat Pulldowns (Cable Machine)',
            dayOfWeek: 'Friday',
            targetMuscle: 'Back',
            sets: 3,
            reps: '10-12',
            weight: '55 kg',
            restSeconds: 60,
            order: 5,
          },
        ],
      },
    },
  });

  // 8. Payments
  await prisma.payment.createMany({
    data: [
      {
        receiptNo: 'REC-2026-0001',
        memberProfileId: m1.id,
        membershipPlanId: planAnnual.id,
        amount: 7999,
        paymentMethod: 'UPI',
        paymentDate: new Date(now.getFullYear(), now.getMonth(), 2),
        status: 'PAID',
        notes: 'Annual gym fee paid via Google Pay UPI to gym account.',
        recordedBy: 'Admin (Sachin Patel)',
      },
      {
        receiptNo: 'REC-2026-0002',
        memberProfileId: m2.id,
        membershipPlanId: planQuarterly.id,
        amount: 2499,
        paymentMethod: 'UPI',
        paymentDate: new Date(now.getFullYear(), now.getMonth(), 5),
        status: 'PAID',
        notes: '3-Month fee paid via PhonePe UPI.',
        recordedBy: 'Admin (Sachin Patel)',
      },
      {
        receiptNo: 'REC-2026-0003',
        memberProfileId: m3.id,
        membershipPlanId: planMonthly.id,
        amount: 999,
        paymentMethod: 'CASH',
        paymentDate: new Date(now.getFullYear(), now.getMonth(), 10),
        status: 'PAID',
        notes: 'Monthly fee paid in cash at reception counter.',
        recordedBy: 'Admin (Sachin Patel)',
      },
    ],
  });

  // 9. Attendance
  const todayStr = now.toISOString().split('T')[0];
  const pastDates: string[] = [];
  for (let i = 1; i <= 6; i++) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    pastDates.push(d.toISOString().split('T')[0]);
  }

  // Today attendance
  await prisma.attendance.createMany({
    data: [
      {
        memberProfileId: m1.id,
        date: todayStr,
        checkInTime: '06:15 AM',
        status: 'PRESENT',
        notes: 'Chest and triceps workout with Coach Sachin',
      },
      {
        memberProfileId: m2.id,
        date: todayStr,
        checkInTime: '07:05 AM',
        status: 'PRESENT',
        notes: 'Morning cardio session',
      },
      {
        memberProfileId: m3.id,
        date: todayStr,
        checkInTime: '06:00 PM',
        status: 'PRESENT',
        notes: 'Evening fitness workout',
      },
    ],
  });

  for (const pDate of pastDates) {
    await prisma.attendance.create({
      data: {
        memberProfileId: m1.id,
        date: pDate,
        checkInTime: '06:20 AM',
        status: 'PRESENT',
      },
    });
  }

  // 10. Notices (Clear and simple Indian English)
  await prisma.notice.createMany({
    data: [
      {
        title: '📢 Gym Timings Notice — Morning & Evening Batches',
        content: 'Gym is open Monday to Saturday from 5:00 AM to 10:00 AM in the morning, and 5:00 PM to 10:00 PM in the evening. Sunday evening timing is 5:00 PM to 9:00 PM. Please bring a clean gym towel and sport shoes.',
        priority: 'NORMAL',
        targetRole: 'ALL',
        isPublished: true,
      },
      {
        title: '🔥 New Weight Plates & Dumbbells Arrived at Iron Revolution!',
        content: 'We have added new Olympic barbells and rubber dumbbells up to 50kg at our Naroli branch. Please re-rack your weights after finishing your sets.',
        priority: 'HIGH',
        targetRole: 'ALL',
        isPublished: true,
      },
      {
        title: '💪 Special Sunday Workout & Form Correction by Coach Sachin',
        content: 'Every Sunday at 6:00 PM, Coach Sachin Patel and Coach Akshay Patel will conduct a free squat, bench press, and deadlift form correction session for all active members.',
        priority: 'NORMAL',
        targetRole: 'MEMBER',
        isPublished: true,
      },
    ],
  });

  console.log('✅ IRON REVOLUTION 2.0 Database successfully updated with real mentors and contact details!');
  console.log('Owner: Sachin Patel | Mentors: Sachin Patel, Akshay Patel, Krutika Patel');
  console.log('Instagram: @ironrevolution_2.0 | Location: Naroli Road, Silvassa');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
