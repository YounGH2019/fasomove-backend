import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone, name } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone is required' });
    }

    const safeName = typeof name === 'string' ? name : '';

    const user = await prisma.user.upsert({
      where: { phone },
      update: { name: safeName },
      create: {
        phone,
        name: safeName,
      },
    });

    return res.json(user);
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone is required' });
    }

    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(user);
  } catch (err) {
    next(err);
  }
};
