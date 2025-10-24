import { Router } from 'express';
import { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse } from '../controllers/CourseController';
import { authenticateToken, authorizeRole } from '../middlewares/AuthMiddleware';

const router = Router();

router.get('/', authenticateToken, authorizeRole(['admin']), getAllCourses);
router.get('/:id', authenticateToken, authorizeRole(['admin']), getCourseById);
router.post('/', authenticateToken, authorizeRole(['admin']), createCourse);
router.put('/:id', authenticateToken, authorizeRole(['admin']), updateCourse);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), deleteCourse);

export default router;
