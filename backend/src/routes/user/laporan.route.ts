import { Router } from 'express';
import { validateBody, validateParams } from '../../middlewares/validation.middleware';
import { createLaporanSchema } from '../../schemas/user/laporan.schema';
import { CreateLaporan, deleteLaporan, getLaporanActive, getLaporanByUser, getLaporanByNama, getLaporanById, getLaporanByCategory } from '../../controllers/user/laporan.controller';
import { verifyToken, authorizeRole } from '../../middlewares/auth.middleware';
import { upload } from '../../middlewares/upload.middleware';

const router = Router();

router.post('/create', verifyToken, authorizeRole(['user']), upload.array('files', 5), validateBody(createLaporanSchema), CreateLaporan);
router.get('/data', verifyToken, authorizeRole(['user']), getLaporanByUser);
router.get('/active', verifyToken, authorizeRole(['user']), getLaporanActive);
router.get('/name/:name', verifyToken, authorizeRole(['user']), getLaporanByNama);
router.get('/id/:id', verifyToken, authorizeRole(['user']),  getLaporanById);
router.get('/category/:category_id', verifyToken, authorizeRole(['user']), getLaporanByCategory);
router.delete('/:id', verifyToken, authorizeRole(['user']), deleteLaporan);

export default router;
