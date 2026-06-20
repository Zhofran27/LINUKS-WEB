import { Router } from 'express';
import { validateBody } from '../../middlewares/validation.middleware';
import { ProfileUser, updateUser, deleteUser, getRecentActivity } from '../../controllers/user/user.controller';
import { updateSchema } from '../../schemas/user/user.schema';
import { verifyToken } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/profile', verifyToken, ProfileUser);
router.get('/recent-activity', verifyToken, getRecentActivity);
router.put('/update', verifyToken, validateBody(updateSchema), updateUser);
router.delete('/delete', verifyToken, deleteUser);

export default router;
