import { Router } from 'express';
import { createRide, getCustomerRides } from '../controllers/rideController';

const router = Router();

router.post('/', createRide);
router.get('/:customerId', getCustomerRides);

export default router;
