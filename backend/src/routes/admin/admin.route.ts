import { Router } from 'express';
import { profileAdmin, getRecentActivity } from '../../controllers/admin/admin.controller';
import { verifyToken } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/profile', verifyToken, profileAdmin);
router.get('/recent-activity', verifyToken, getRecentActivity);

export default router;