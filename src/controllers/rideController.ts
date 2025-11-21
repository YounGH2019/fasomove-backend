import { Request, Response, NextFunction } from 'express';
import { createRide, getRidesByCustomer } from '../services/rideService';

export const createRideHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ride = await createRide(req.body);
    return res.status(201).json(ride);
  } catch (err) {
    next(err);
  }
};

export const getCustomerRidesHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customerId } = req.params;

    if (!customerId) {
      return res.status(400).json({ error: 'customerId is required' });
    }

    const rides = await getRidesByCustomer(customerId);
    return res.json(rides);
  } catch (err) {
    next(err);
  }
};
