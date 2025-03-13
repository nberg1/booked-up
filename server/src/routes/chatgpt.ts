import { Router } from 'express';
// import { authenticateToken } from '../middleware/authMiddleware';
import { generateTags } from '../controllers/chatGPTController';

const router = Router();

// Protect routes with authentication middleware
router.post('/generate-tags', generateTags); // Generate Tags for chosen book using ChatGPT

export default router;