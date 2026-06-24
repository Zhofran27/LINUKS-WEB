import { Router } from 'express';
import { getBooks } from '../../controllers/user/library.controller';

const router = Router();

router.get('/', getBooks);

export default router;