import { Router } from 'express';
import { createEvaluation, getEvaluationById, getAllEvaluations, deleteEvaluation } from '../controllers/EvaluationController';
import { authenticateToken, authorizeRole } from '../middlewares/AuthMiddleware';

const router = Router();

router.post('/', authenticateToken, authorizeRole(['student']), createEvaluation);
router.get('/', authenticateToken, authorizeRole(['admin']), getAllEvaluations);
router.get('/:id', authenticateToken, authorizeRole(['admin', 'student']), getEvaluationById);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), deleteEvaluation);

export default router;
