import { Router } from 'express';
import { validateBody, validateParams } from '../../middlewares/validation.middleware';
import { createLaporanSchema } from '../../schemas/user/laporan.schema';
import { CreateLaporan, getLaporanByUser, getLaporanByNama, getLaporanById, getLaporanByCategory } from '../../controllers/user/laporan.controller';
import { verifyToken, authorizeRole } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/create', verifyToken, authorizeRole(['user']), validateBody(createLaporanSchema), CreateLaporan);
router.get('/data', verifyToken, authorizeRole(['user']), getLaporanByUser);
router.get('/name/:name', verifyToken, authorizeRole(['user']), getLaporanByNama);
router.get('/id/:id', verifyToken, authorizeRole(['user']),  getLaporanById);
router.get('/category/:category_id', verifyToken, authorizeRole(['user']), getLaporanByCategory);

export default router;