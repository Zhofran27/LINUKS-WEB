import { Router } from 'express';
import  userauthRoute  from './user/auth.routes.js';
import adminauthRoute from './admin/auth.route.js';
import userRoute from './user/user.route.js'

const router = Router();

router.use('/Authuser', userauthRoute);
router.use('/Authadmin', adminauthRoute);
router.use('/user', userRoute);

export default router;