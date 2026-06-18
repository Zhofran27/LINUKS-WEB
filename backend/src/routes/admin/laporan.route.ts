import { Router } from 'express';
import { getLaporan, getLaporanById, getLaporanDetail, getLaporanOverview, getLaporanByCategory, getLaporanByNama } from '../../controllers/admin/laporan.controller';
import { authorizeRole, verifyToken } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/overview', verifyToken, authorizeRole(['admin']), getLaporanOverview);
router.get('/data', verifyToken, authorizeRole(['admin']), getLaporan);
router.get('/id/:id', verifyToken, authorizeRole(['admin']), getLaporanById);
router.get('/detail/:id', verifyToken, authorizeRole(['admin']), getLaporanDetail);
router.get('/category/:category_id', verifyToken, authorizeRole(['admin']), getLaporanByCategory);
router.get('/name/:name', verifyToken, authorizeRole(['admin']), getLaporanByNama);

export default router;
