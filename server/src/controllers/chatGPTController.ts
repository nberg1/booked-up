import { Request, Response } from 'express';
import { generateTagsForBook, generateCategorizedTagsForBook } from '../helpers/chatGPTHelper';

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
        const tags = await generateTagsForBook(title, author, description);
        res.json({ tags });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to generate tags" });
    }
};

/**
 * POST /generate-categorized-tags
 * Calls ChatGPT and generates categorized tags for the book provided
 */
export const generateCategorizedTags = async (req: Request, res: Response): Promise<void> => {
    const { title, author, description } = req.body;

    if (!title || !author) {
        res.status(400).json({ error: "Book title and author are required" });
        return;
    }
    try {
        const categorizedTags = await generateCategorizedTagsForBook(title, author, description);
        // Also return a flat array for backward compatibility
        const allTags = [
            ...categorizedTags.emotional,
            ...categorizedTags.pacing,
            ...categorizedTags.vibes,
            ...categorizedTags.aesthetic,
            ...categorizedTags.tropes,
            ...categorizedTags.general
        ];
        res.json({ 
            tags: allTags,
            categorized: categorizedTags 
        });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to generate categorized tags" });
    }
};
