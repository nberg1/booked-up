import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getDefaultPriority } from '../services/prioritizationService';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
  }
}

const prisma = new PrismaClient();

/**
 * GET /api/books
 * Returns all books for the authenticated user, ordered by user-defined priority.
 */
export const getBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    const userBooks = await prisma.userBook.findMany({
      where: { userId },
      include: { book: true },
      orderBy: { priority: 'asc' }
    });
    res.json(userBooks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/books/:id
 * Returns a single book entry for the authenticated user by book ID.
 */
// TODO: DO WE NEED THIS???
export const getBookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookId = parseInt(req.params.id, 10);
    const userId = (req as AuthenticatedRequest).user?.id;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    const userBook = await prisma.userBook.findFirst({
      where: { userId, bookId },
      include: { book: true }
    });
    if (!userBook) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }
    res.json(userBook);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST /api/books
 * Creates a new book entry and adds it to the user's TBR list with a default ordering.
 * Expects: { title, author, genre, tags: string[] }
 */
export const createBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, author, description, isbn, tags } = req.body;
    const userId = (req as AuthenticatedRequest).user?.id;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // Default tags to an empty array if not provided
    const tagList: string[] = tags ? tags : [];

    // Create the book with associated tags (using connectOrCreate)
    const book = await prisma.book.create({
      data: {
        title,
        author,
        description,
        isbn,
        tags: {
          connectOrCreate: tagList.map((tagName: string) => ({
            where: { name: tagName },
            create: { name: tagName }
          }))
        }
      },
      include: { tags: true }
    });

    const defaultPriority = await getDefaultPriority(userId);

    // Link the book to the user in the UserBook join table
    const userBook = await prisma.userBook.create({
      data: {
        userId,
        bookId: book.id,
        priority: defaultPriority,
        status: 'to-read'
      }
    });

    res.status(201).json({ book, userBook });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * PUT /api/books/:id
 * Updates book details or status for a user's TBR entry.
 * Expects updated fields in the request body.
 */
export const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookId = parseInt(req.params.id, 10);
    const userId = (req as AuthenticatedRequest).user?.id;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    const { title, author, description, isbn, tags, status } = req.body;

    // If book details are provided, update the book record
    if (title || author || description || isbn || tags) {
      await prisma.book.update({
        where: { id: bookId },
        data: {
          title,
          author,
          description,
          isbn,
          tags: tags
            ? {
                // Update tags using connectOrCreate, similar to creation
                connectOrCreate: tags.map((tagName: string) => ({
                  where: { name: tagName },
                  create: { name: tagName }
                }))
              }
            : undefined
        }
      });
    }

    // Update the join record (UserBook) if status is provided.
    if (status) {
      await prisma.userBook.updateMany({
        where: { userId, bookId },
        data: { status }
      });
    }

    res.json({ message: 'Book updated successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * PUT /api/books/order/update
 * Updates the ordering (priority) for multiple books in the user's TBR list.
 * Expects an array of objects: [{ id: userBookId, priority: newPriority }, ...]
 */
export const updateBookOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    // Expect an array of { id: number, priority: number }
    const updates: { id: number; priority: number }[] = req.body.updates;

    const updatePromises = updates.map((update) =>
      prisma.userBook.update({
        where: { id: update.id },
        data: { priority: update.priority }
      })
    );

    await Promise.all(updatePromises);
    res.json({ message: 'Book order updated successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * DELETE /api/books/:id
 * Removes a book from the authenticated user's TBR list.
 */
export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookId = parseInt(req.params.id, 10);
    const userId = (req as AuthenticatedRequest).user?.id;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    await prisma.userBook.deleteMany({
      where: { userId, bookId }
    });
    res.json({ message: 'Book removed from TBR list' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
