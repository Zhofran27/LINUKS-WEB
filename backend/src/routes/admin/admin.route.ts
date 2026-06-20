import { Router } from 'express';
import { profileAdmin } from '../../controllers/admin/admin.controller';
import { verifyToken } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/profile', verifyToken, profileAdmin);

export default router;