import { Router } from 'express';
import { adminLogin } from '../../controllers/admin/auth.controller';
import { validateBody } from '../../middlewares/validation.middleware';
import { adminLoginSchema } from '../../schemas/admin/auth.schema';

const router = Router();

router.post('/login', validateBody(adminLoginSchema),  adminLogin);

export default router;