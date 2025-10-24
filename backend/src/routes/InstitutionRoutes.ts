import { Router } from 'express';
import { getAllInstitutions, getInstitutionById, createInstitution, updateInstitution, deleteInstitution } from '../controllers/InstitutionController';
import { authenticateToken, authorizeRole } from '../middlewares/AuthMiddleware';

const router = Router();

router.get('/', authenticateToken, authorizeRole(['admin']), getAllInstitutions);
router.get('/:id', authenticateToken, authorizeRole(['admin']), getInstitutionById);
router.post('/', authenticateToken, authorizeRole(['admin']), createInstitution);
router.put('/:id', authenticateToken, authorizeRole(['admin']), updateInstitution);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), deleteInstitution);

export default router;
