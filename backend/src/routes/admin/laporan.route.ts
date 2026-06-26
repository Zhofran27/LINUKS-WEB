import { Router } from 'express';
import { getLaporan, getLaporanById, getLaporanDetail, getLaporanOverview, getLaporanPerMonth, getLaporanByCategory, getLaporanByNama, updateStatusLaporan } from '../../controllers/admin/laporan.controller.js';
import { authorizeRole, verifyToken } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/overview', verifyToken, authorizeRole(['admin']), getLaporanOverview);
router.get('/monthly', verifyToken, authorizeRole(['admin']), getLaporanPerMonth);
router.get('/data', verifyToken, authorizeRole(['admin']), getLaporan);
router.get('/id/:id', verifyToken, authorizeRole(['admin']), getLaporanById);
router.get('/detail/:id', verifyToken, authorizeRole(['admin']), getLaporanDetail);
router.get('/category/:category_id', verifyToken, authorizeRole(['admin']), getLaporanByCategory);
router.get('/name/:name', verifyToken, authorizeRole(['admin']), getLaporanByNama);
router.patch('/status/:id', verifyToken, authorizeRole(['admin']), updateStatusLaporan);

export default router;
