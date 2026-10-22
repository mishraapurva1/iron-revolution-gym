import request from 'supertest';
import app from '../server/app';
import prisma from '../server/config/db';
import bcrypt from 'bcryptjs';

describe('IRON REVOLUTION Backend Test Suite', () => {
  let adminToken: string;
  let trainerToken: string;
  let memberToken: string;
  let testMemberId: string;
  let testPlanId: string;

  beforeAll(async () => {
    // Ensure clean state for test run
    await prisma.attendance.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.workoutExercise.deleteMany();
    await prisma.workoutPlan.deleteMany();
    await prisma.workoutClass.deleteMany();
    await prisma.memberProfile.deleteMany();
    await prisma.trainerProfile.deleteMany();
    await prisma.membershipPlan.deleteMany();
    await prisma.user.deleteMany();

    const adminHash = await bcrypt.hash('Admin@123', 10);
    const trainerHash = await bcrypt.hash('Trainer@123', 10);
    const memberHash = await bcrypt.hash('Member@123', 10);

    // Create plan
    const plan = await prisma.membershipPlan.create({
      data: {
        name: 'Quarterly Test Plan',
        description: '3 months',
        durationMonths: 3,
        price: 2500,
        benefits: 'All gym access',
      },
    });
    testPlanId = plan.id;

    // Create Admin user
    await prisma.user.create({
      data: {
        email: 'testadmin@ironrevolution.com',
        passwordHash: adminHash,
        role: 'ADMIN',
      },
    });

    // Create Trainer user
    await prisma.user.create({
      data: {
        email: 'testtrainer@ironrevolution.com',
        passwordHash: trainerHash,
        role: 'TRAINER',
        trainerProfile: {
          create: {
            trainerId: 'IR-TRN-901',
            fullName: 'Test Trainer',
            phone: '9876500000',
            specialization: 'Conditioning',
          },
        },
      },
    });

    // Create Member user
    const memberUser = await prisma.user.create({
      data: {
        email: 'testmember@ironrevolution.com',
        passwordHash: memberHash,
        role: 'MEMBER',
        memberProfile: {
          create: {
            memberId: 'IR-MEM-901',
            fullName: 'Test Member',
            phone: '9876511111',
            status: 'ACTIVE',
            membershipPlanId: plan.id,
          },
        },
      },
      include: { memberProfile: true },
    });
    testMemberId = memberUser.memberProfile!.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('1. Authentication Tests', () => {
    it('should login successfully with correct admin credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'testadmin@ironrevolution.com', password: 'Admin@123' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.role).toBe('ADMIN');
      adminToken = res.body.token;
    });

    it('should login successfully with trainer and member credentials', async () => {
      const trainerRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'testtrainer@ironrevolution.com', password: 'Trainer@123' });
      expect(trainerRes.status).toBe(200);
      trainerToken = trainerRes.body.token;

      const memberRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'testmember@ironrevolution.com', password: 'Member@123' });
      expect(memberRes.status).toBe(200);
      memberToken = memberRes.body.token;
    });

    it('should fail login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'testadmin@ironrevolution.com', password: 'WrongPassword' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should register a new member with PENDING status and MEMBER role', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'New Trainee',
          email: 'trainee@example.com',
          phone: '9898989898',
          password: 'Password@123',
          confirmPassword: 'Password@123',
          membershipPlanId: testPlanId,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.user.role).toBe('MEMBER');
      expect(res.body.user.memberProfile.status).toBe('PENDING');
    });

    it('should reject registration with duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Duplicate Trainee',
          email: 'trainee@example.com',
          phone: '9898989898',
          password: 'Password@123',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('already exists');
    });
  });

  describe('2. Role-Based Authorization & Privacy Tests', () => {
    it('should reject unauthenticated request to /api/members', async () => {
      const res = await request(app).get('/api/members');
      expect(res.status).toBe(401);
    });

    it('should deny member role from creating a new member', async () => {
      const res = await request(app)
        .post('/api/members')
        .set('Authorization', `Bearer ${memberToken}`)
        .send({
          fullName: 'Hacker Member',
          email: 'hacker@example.com',
          phone: '1234567890',
        });

      expect(res.status).toBe(403);
    });

    it('should allow admin to create a member with automatic expiry date calculation', async () => {
      const res = await request(app)
        .post('/api/members')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          fullName: 'Siddharth Roy',
          email: 'siddharth@example.com',
          phone: '9876543210',
          membershipPlanId: testPlanId,
          startDate: '2026-01-01',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.memberId).toMatch(/^IR-MEM-/);
      expect(res.body.data.membershipExpiryDate).toBeDefined();

      const startDate = new Date(res.body.data.membershipStartDate);
      const expiryDate = new Date(res.body.data.membershipExpiryDate);
      const diffMonths = (expiryDate.getFullYear() - startDate.getFullYear()) * 12 + (expiryDate.getMonth() - startDate.getMonth());
      expect(diffMonths).toBe(3); // Quarterly plan = 3 months
    });
  });

  describe('3. Attendance & Duplicate Prevention Tests', () => {
    it('should record attendance for a member', async () => {
      const res = await request(app)
        .post('/api/attendance')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          memberProfileId: testMemberId,
          date: '2026-05-10',
          checkInTime: '06:30 AM',
          status: 'PRESENT',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.status).toBe('PRESENT');
    });

    it('should PREVENT duplicate attendance for the same member on the same date', async () => {
      const res = await request(app)
        .post('/api/attendance')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          memberProfileId: testMemberId,
          date: '2026-05-10',
          checkInTime: '07:00 AM',
          status: 'PRESENT',
        });

      expect(res.status).toBe(409);
      expect(res.body.message).toContain('Attendance already recorded');
    });
  });

  describe('4. Payment Record & Receipt Tests', () => {
    it('should record a payment and generate unique receipt number', async () => {
      const res = await request(app)
        .post('/api/payments')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          memberProfileId: testMemberId,
          amount: 2500,
          paymentMethod: 'UPI',
          status: 'PAID',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.receiptNo).toMatch(/^REC-/);
      expect(res.body.data.amount).toBe(2500);
    });

    it('should allow member to fetch their own payments and receipt', async () => {
      const res = await request(app)
        .get('/api/payments')
        .set('Authorization', `Bearer ${memberToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].memberProfile.id).toBe(testMemberId);
    });
  });
});
