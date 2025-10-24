import { Router } from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/UserController';
import { authenticateToken, authorizeRole } from '../middlewares/AuthMiddleware';

const router = Router();

router.get('/', authenticateToken, authorizeRole(['admin']), getAllUsers);
router.get('/:id', authenticateToken, authorizeRole(['admin']), getUserById);
router.post('/', authenticateToken, authorizeRole(['admin']), createUser);
router.put('/:id', authenticateToken, authorizeRole(['admin']), updateUser);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), deleteUser);

export default router;
