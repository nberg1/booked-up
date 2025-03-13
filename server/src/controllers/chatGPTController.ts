import { Request, Response } from 'express';
import OpenAI from "openai";

// Configure the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * POST /generate-tags
 * Calls ChatGPT and generates short tags for the book provided
 */
export const generateTags = async (req: Request, res: Response): Promise<void> => {
    console.log("GENERATE TAGS");
    try {
        const { title, author, description } = req.body;
        if (!title && !author) {
        res.status(400).json({ error: "Book title and author are required" });
        return;
        }

        // Compose a prompt for ChatGPT
        let prompt = `Generate some custom tags (one to two word) for the book "${title}" by ${author} that readers would like to filter their book searches by. Here's the book's summary you can use: ${description}`;
        prompt += " Return the tags as a comma-separated list.";

        // Call the OpenAI API
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            store: true,
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        const text = completion.choices[0].message.content || "";

        // Split the response into tags by commas and trim whitespace
        const tags = text.split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0);
        console.log(tags);
        
        res.json({ tags });
    } catch (error: any) {
        console.error('Error generating tags:', error);
        res.status(500).json({ error: "Failed to generate tags" });
    }
};
