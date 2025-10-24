import { Router } from 'express';
import { getAnalysisReport } from '../controllers/AnalysisController';
import { authenticateToken, authorizeRole } from '../middlewares/AuthMiddleware';

const router = Router();

router.get('/', authenticateToken, authorizeRole(['admin']), getAnalysisReport);

export default router;
