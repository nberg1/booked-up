import { Router } from 'express';
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  updateBookOrder,
  getFinishedBooks,
  updateBookStatus,
  updateUserBookTags
} from '../controllers/bookController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Protect routes with authentication middleware
router.get('/', authenticateToken, getBooks); // Get all books for the authenticated user
router.get('/finished', authenticateToken, getFinishedBooks); // Get all finished books for the authenticated user
router.get('/:id', authenticateToken, getBookById); // Get a single book by its ID
router.post('/', authenticateToken, createBook); // Add a new book to TBR list
router.put('/:id', authenticateToken, updateBook); // Update a book's details or priority
router.put('/status/:id', authenticateToken, updateBookStatus); // Update a user book's status
router.delete('/:id', authenticateToken, deleteBook); // Remove a book from the list
router.put('/order/update', authenticateToken, updateBookOrder); // Update the priority order of books
router.put('/:id/tags', authenticateToken, updateUserBookTags); // Update tags that the user chooses for a book


export default router;