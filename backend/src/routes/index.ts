import { Router } from 'express';
import  userauthRoute  from './user/auth.routes.js';
import adminauthRoute from './admin/auth.route.js';

const router = Router();

router.use('/user', userauthRoute);
router.use('/admin', adminauthRoute);

export default router;