import OpenAI from "openai";

// Configure the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * generateTagsForBook
 * @param title - The title of the book.
 * @param description - Optional description of the book.
 * @returns A promise that resolves to an array of suggested tags.
 */
export const generateTagsForBook = async (title: string, author: string, description?: string | null): Promise<string[]> => {
    // Compose a prompt for ChatGPT
    let prompt = `Generate 10 custom tags (one to two word) for the book "${title}" by ${author} that readers would like to filter their book searches by. Here's the book's summary you can use: ${description}`;
    prompt += " Return the tags as a comma-separated list.";
    try {
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
        return tags;
    } catch (error) {
        console.error("Error generating tags:", error);
        return [];
    }
};
