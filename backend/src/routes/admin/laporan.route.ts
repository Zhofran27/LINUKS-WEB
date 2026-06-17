import { Router } from 'express';
import { getLaporan, getLaporanById, getLaporanDetail, getLaporanOverview } from '../../controllers/admin/laporan.controller';
import { authorizeRole, verifyToken } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/overview', verifyToken, authorizeRole(['admin']), getLaporanOverview);
router.get('/data', verifyToken, authorizeRole(['admin']), getLaporan);
router.get('/id/:id', verifyToken, authorizeRole(['admin']), getLaporanById);
router.get('/detail/:id', verifyToken, authorizeRole(['admin']), getLaporanDetail);

export default router;
