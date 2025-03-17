import { Request, Response } from 'express';
import { generateTagsForBook } from '../helpers/chatGPTHelper';

/**
 * POST /generate-tags
 * Calls ChatGPT and generates short tags for the book provided
 */
export const generateTags = async (req: Request, res: Response): Promise<void> => {
    const { title, author, description } = req.body;

    if (!title && !author) {
        res.status(400).json({ error: "Book title and author are required" });
        return;
    }
    try {
        const tags = await generateTagsForBook(title, description);
        res.json({ tags });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to generate tags" });
    }
};
