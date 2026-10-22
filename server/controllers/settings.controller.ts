import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

export const getGymSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    let settings = await prisma.gymSetting.findUnique({
      where: { id: 'default-gym-settings' },
    });

    if (!settings) {
      settings = await prisma.gymSetting.create({
        data: {
          id: 'default-gym-settings',
          gymName: 'IRON REVOLUTION',
          ownerName: 'Sachin Patel',
          developerName: 'Apurva Mishra',
          locationAddress: 'Naroli, Silvassa, Dadra and Nagar Haveli, India — 396235',
          phone: '+91 98765 43210',
          email: 'info@ironrevolution.demo',
          openingHours: 'Mon-Sat: 5:30 AM - 10:00 PM | Sun: 6:00 AM - 1:00 PM',
          announcement: 'Forging champions every day. State of the art equipment & certified trainers.',
        },
      });
    }

    res.status(200).json({ success: true, data: settings });
  } catch (error: any) {
    console.error('getGymSettings error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch settings.' });
  }
};

export const updateGymSettings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { gymName, ownerName, developerName, locationAddress, phone, email, openingHours, announcement } = req.body;

    const settings = await prisma.gymSetting.upsert({
      where: { id: 'default-gym-settings' },
      update: {
        gymName,
        ownerName,
        developerName,
        locationAddress,
        phone,
        email,
        openingHours,
        announcement,
      },
      create: {
        id: 'default-gym-settings',
        gymName: gymName || 'IRON REVOLUTION',
        ownerName: ownerName || 'Sachin Patel',
        developerName: developerName || 'Apurva Mishra',
        locationAddress: locationAddress || 'Naroli, Silvassa, Dadra and Nagar Haveli, India — 396235',
        phone: phone || '+91 98765 43210',
        email: email || 'info@ironrevolution.demo',
        openingHours: openingHours || 'Mon-Sat: 5:30 AM - 10:00 PM | Sun: 6:00 AM - 1:00 PM',
        announcement,
      },
    });

    res.status(200).json({ success: true, message: 'Gym configuration updated successfully.', data: settings });
  } catch (error: any) {
    console.error('updateGymSettings error:', error);
    res.status(500).json({ success: false, message: 'Failed to update settings.' });
  }
};
