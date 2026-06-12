import { Router } from 'express';
import { validateBody, validateParams } from '../../middlewares/validation.middleware';
import { registerSchema, loginSchema } from '../../schemas/user/auth.schema';
import { register, login, googleLogin, googleCallback } from '../../controllers/user/auth.controller';

const router = Router();

router.post('/register', validateBody(registerSchema),  register);
router.post('/login', validateBody(loginSchema), login);
router.get('/google', googleLogin);
router.get('/google/callback', googleCallback);

export default router;