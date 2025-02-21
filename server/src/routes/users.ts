import { Router } from 'express';
import { signup, login, getProfile } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
// Only protect endpoints that require the user to be logged in:
router.get('/profile', authenticateToken, getProfile);

export default router;