import { Request, Response, NextFunction } from 'express';
import * as rideService from '../services/rideService';

export const createRide = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const ride = await rideService.createRide(req.body);
    res.status(201).json(ride);
  } catch (err) {
    next(err);
  }
};

export const getCustomerRides = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { customerId } = req.params;

    if (!customerId) {
      res.status(400).json({ error: 'customerId is required' });
      return;
    }

    const rides = await rideService.getRidesByCustomer(customerId);
    res.json(rides);
  } catch (err) {
    next(err);
  }
};
