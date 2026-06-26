import { Router } from 'express';
import { validateBody, validateParams } from '../../middlewares/validation.middleware.js';
import { registerSchema, loginSchema } from '../../schemas/user/auth.schema.js';
import { register, login, googleLogin, googleCallback } from '../../controllers/user/auth.controller.js';

const router = Router();

router.post('/register', validateBody(registerSchema),  register);
router.post('/login', validateBody(loginSchema), login);
router.get('/google', googleLogin);
router.get('/google/callback', googleCallback);

export default router;