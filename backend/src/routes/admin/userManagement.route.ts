import { Router } from 'express';
import { deactivateUser, getAllUsers, reactivateUser, updateRoleUser } from '../../controllers/admin/userManagement.controller';
import { authorizeRole, verifyToken } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/data', verifyToken, authorizeRole(['admin']), getAllUsers);
router.patch('/role/:id', verifyToken, authorizeRole(['admin']), updateRoleUser);
router.patch('/deactivate/:id', verifyToken, authorizeRole(['admin']), deactivateUser);
router.patch('/reactivate/:id', verifyToken, authorizeRole(['admin']), reactivateUser);

export default router;
