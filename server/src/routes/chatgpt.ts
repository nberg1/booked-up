import { Router } from 'express';
// import { authenticateToken } from '../middleware/authMiddleware';
import { generateTags, generateCategorizedTags } from '../controllers/chatGPTController';

const router = Router();

// Protect routes with authentication middleware
router.post('/generate-tags', generateTags); // Generate Tags for chosen book using ChatGPT
router.post('/generate-categorized-tags', generateCategorizedTags); // Generate categorized tags with emotional/vibe categories

export default router;