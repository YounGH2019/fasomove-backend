import { Router } from 'express';
import { createRideHandler, getCustomerRidesHandler } from '../controllers/rideController';

const router = Router();

// POST /api/rides
router.post('/', createRideHandler);

// GET /api/rides/:customerId
router.get('/:customerId', getCustomerRidesHandler);

export default router;
