import { Router } from 'express';
import  userauthRoute  from './user/auth.routes.js';
import adminauthRoute from './admin/auth.route.js';
import userRoute from './user/user.route.js'
import laporanRoute from './user/laporan.route.js'
import adminLaporanRoute from './admin/laporan.route.js'

const router = Router();

router.use('/Authuser', userauthRoute);
router.use('/Authadmin', adminauthRoute);
router.use('/user', userRoute);
router.use('/laporan', laporanRoute);
router.use('/admin/laporan', adminLaporanRoute);

export default router;
