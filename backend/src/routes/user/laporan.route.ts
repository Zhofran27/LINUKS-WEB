import { Router } from 'express';
import { validateBody, validateParams } from '../../middlewares/validation.middleware';
import { createLaporanSchema } from '../../schemas/user/laporan.schema';
import { CreateLaporan, getLaporanByUser, getLaporanByNama, getLaporanById, getLaporanByCategory } from '../../controllers/user/laporan.controller';
import { verifyToken, authorizeRole } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/create', verifyToken, authorizeRole(['user']), validateBody(createLaporanSchema), CreateLaporan);
router.get('/user/:id', verifyToken, authorizeRole(['user']), validateParams(createLaporanSchema), getLaporanByUser);
router.get('/name/:name', verifyToken, authorizeRole(['user']), validateParams(createLaporanSchema), getLaporanByNama);
router.get('/id/:id', verifyToken, authorizeRole(['user']), validateParams(createLaporanSchema), getLaporanById);
router.get('/category/:category_id', verifyToken, authorizeRole(['user']), validateParams(createLaporanSchema), getLaporanByCategory);

export default router;