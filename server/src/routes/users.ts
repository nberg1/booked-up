import { Router } from 'express';
import { signup, login, getProfile } from '../controllers/userController';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', getProfile);

export default router;