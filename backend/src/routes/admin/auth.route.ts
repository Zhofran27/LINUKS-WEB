import { Router } from 'express';
import { adminLogin } from '../../controllers/admin/auth.controller.js';
import { validateBody } from '../../middlewares/validation.middleware.js';
import { adminLoginSchema } from '../../schemas/admin/auth.schema.js';

const router = Router();

router.post('/login', validateBody(adminLoginSchema),  adminLogin);

export default router;