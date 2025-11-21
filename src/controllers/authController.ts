import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { phone, role } = req.body;

    if (!phone || !role) {
      res.status(400).json({ error: 'Phone and role are required' });
      return;
    }

    const user = await prisma.user.upsert({
      where: { phone },
      update: { role },
      create: { phone, role },
    });

    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { phone } = req.body;

    if (!phone) {
      res.status(400).json({ error: 'Phone is required' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};
