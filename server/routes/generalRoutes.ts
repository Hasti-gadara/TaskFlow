import { Router } from 'express';
import { getHealth } from '../controllers/generalController.ts';

const router = Router();

router.get('/health', getHealth);

export default router;
