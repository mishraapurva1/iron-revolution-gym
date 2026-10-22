import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  memberProfileId?: string;
  trainerProfileId?: string;
  fullName?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'iron_revolution_super_secure_jwt_secret_key_2026_xyz';

    const decoded = jwt.verify(token, secret) as { id: string; role: string; email: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        memberProfile: true,
        trainerProfile: true,
      },
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'User not found or session expired.' });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      memberProfileId: user.memberProfile?.id,
      trainerProfileId: user.trainerProfile?.id,
      fullName: user.memberProfile?.fullName || user.trainerProfile?.fullName || 'Administrator',
    };

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};
