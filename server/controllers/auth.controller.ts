import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';
import { generateMemberId } from '../utils/idGenerator';

const JWT_SECRET = process.env.JWT_SECRET || 'iron_revolution_super_secure_jwt_secret_key_2026_xyz';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, phone, password, confirmPassword, dateOfBirth, gender, membershipPlanId } = req.body;

    if (!fullName || !email || !phone || !password) {
      res.status(400).json({ success: false, message: 'Full name, email, phone, and password are required.' });
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      res.status(400).json({ success: false, message: 'Passwords do not match.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
      return;
    }

    // Check duplicate email
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const memberId = await generateMemberId();

    // Calculate initial dates if plan selected
    let membershipStartDate: Date | null = null;
    let membershipExpiryDate: Date | null = null;
    let planIdToAssign: string | null = null;

    if (membershipPlanId) {
      const plan = await prisma.membershipPlan.findUnique({ where: { id: membershipPlanId } });
      if (plan) {
        planIdToAssign = plan.id;
        membershipStartDate = new Date();
        membershipExpiryDate = new Date();
        membershipExpiryDate.setMonth(membershipExpiryDate.getMonth() + plan.durationMonths);
      }
    }

    // Create user and member profile in a transaction
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        role: 'MEMBER', // Strictly enforce MEMBER role for public registrations
        memberProfile: {
          create: {
            memberId,
            fullName,
            phone,
            dateOfBirth: dateOfBirth || null,
            gender: gender || 'Not Specified',
            status: 'PENDING', // Awaiting admin confirmation
            membershipPlanId: planIdToAssign,
            membershipStartDate,
            membershipExpiryDate,
          },
        },
      },
      include: {
        memberProfile: {
          include: {
            membershipPlan: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Your account is pending activation by gym management.',
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        memberProfile: newUser.memberProfile,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during registration.', error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide both email and password.' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        memberProfile: {
          include: {
            membershipPlan: true,
            assignedTrainer: true,
          },
        },
        trainerProfile: true,
      },
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    // Check account status if member or trainer
    if (user.role === 'MEMBER' && user.memberProfile?.status === 'INACTIVE') {
      res.status(403).json({ success: false, message: 'Your account is deactivated. Please contact gym administration.' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const displayName = user.memberProfile?.fullName || user.trainerProfile?.fullName || 'Administrator';

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: displayName,
        memberProfile: user.memberProfile,
        trainerProfile: user.trainerProfile,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during login.', error: error.message });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        memberProfile: {
          include: {
            membershipPlan: true,
            assignedTrainer: true,
            payments: {
              orderBy: { createdAt: 'desc' },
              take: 5,
            },
            attendances: {
              orderBy: { date: 'desc' },
              take: 10,
            },
          },
        },
        trainerProfile: {
          include: {
            assignedMembers: true,
            workoutClasses: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User record not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        memberProfile: user.memberProfile,
        trainerProfile: user.trainerProfile,
      },
    });
  } catch (error: any) {
    console.error('GetMe error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
  }
};
