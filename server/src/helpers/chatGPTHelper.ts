import OpenAI from "openai";
import { getPopularTagsByCategory, matchOrCreateTags } from "../services/tagService";

// Configure the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface CategorizedTags {
  emotional: string[];
  pacing: string[];
  vibes: string[];
  aesthetic: string[];
  tropes: string[];
  general: string[];
}

/**
 * generateTagsForBook
 * @param title - The title of the book.
 * @param description - Optional description of the book.
 * @returns A promise that resolves to an array of suggested tags.
 */
export const generateTagsForBook = async (title: string, author: string, description?: string | null): Promise<string[]> => {
    // Get existing popular tags to provide context
    const existingTags = await getPopularTagsByCategory(10);
    const allExistingTags = Object.values(existingTags).flat();
    
    // Compose a prompt for ChatGPT with enhanced tag categories
    const prompt = `You are a book tagging expert familiar with BookTok and online reading communities. Generate tags for the book "${title}" by ${author}.

${description ? `Book description: ${description}` : ''}

IMPORTANT: Here are popular existing tags in our system. Please prefer these exact tags when they accurately describe the book:
${allExistingTags.join(', ')}

Generate tags in these categories:
1. EMOTIONAL IMPACT (how the book makes you feel): Examples: "ugly cry worthy", "comfort read", "soul crushing", "feel good", "emotional rollercoaster"
2. PACING/READING EXPERIENCE: Examples: "slow burn", "page turner", "DNF risk until 40%", "binge worthy", "can't put down"
3. CHARACTER VIBES: Examples: "morally grey love interest", "sunshine character", "villain you'll love", "cinnamon roll hero", "badass FMC"
4. AESTHETIC/ATMOSPHERE: Examples: "dark academia", "cozy vibes", "small town", "gothic", "whimsical"
5. TROPES (if applicable): Examples: "enemies to lovers", "found family", "chosen one", "fake dating", "second chance"

Return 15-20 tags total, with at least 2-3 from each category. Make them specific to this book based on the description.
Prefer existing tags from the list above when they match the book's content.
Format: Return ONLY a comma-separated list of tags, nothing else.`;

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
            temperature: 0.8, // Slightly higher for more creative tags
        });
        const text = completion.choices[0].message.content || "";

        // Split the response into tags by commas and trim whitespace
        const generatedTags = text.split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0)
        .slice(0, 20); // Limit to 20 tags max
        
        // Process through our matching system
        const matchedTags = await matchOrCreateTags(generatedTags);
        return matchedTags.map(t => t.name);
    } catch (error) {
        console.error("Error generating tags:", error);
        return [];
    }
};

/**
 * generateCategorizedTagsForBook
 * @param title - The title of the book.
 * @param author - The author of the book.
 * @param description - Optional description of the book.
 * @returns A promise that resolves to categorized tags.
 */
export const generateCategorizedTagsForBook = async (
    title: string, 
    author: string, 
    description?: string | null
): Promise<CategorizedTags> => {
    // Get existing popular tags to provide context
    const existingTags = await getPopularTagsByCategory(15);
    
    const prompt = `You are a book tagging expert familiar with BookTok and online reading communities. Generate categorized tags for the book "${title}" by ${author}.

${description ? `Book description: ${description}` : ''}

IMPORTANT: Here are popular existing tags in our system. Please prefer these exact tags when they accurately describe the book:
${JSON.stringify(existingTags, null, 2)}

Generate tags in these specific categories. Return a JSON object with these exact keys:

{
  "emotional": [/* 3-4 tags about emotional impact like "ugly cry worthy", "comfort read", "soul crushing" */],
  "pacing": [/* 2-3 tags about reading experience like "slow burn", "page turner", "binge worthy" */],
  "vibes": [/* 3-4 character/relationship tags like "morally grey love interest", "sunshine character" */],
  "aesthetic": [/* 2-3 atmosphere tags like "dark academia", "cozy vibes", "gothic" */],
  "tropes": [/* 2-4 story tropes if applicable like "enemies to lovers", "found family" */],
  "general": [/* 2-3 general genre/theme tags */]
}

Prefer existing tags from the list above when they match the book's content. Only create new tags when the existing ones don't capture unique aspects.
Make tags specific to this book. Use trendy BookTok language when appropriate.
Return ONLY the JSON object, no other text.`;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            store: true,
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.8,
            response_format: { type: "json_object" }
        });
        
        const text = completion.choices[0].message.content || "{}";
        const categorizedTags = JSON.parse(text) as CategorizedTags;
        
        // Process each category through our matching system
        const processedCategories: CategorizedTags = {
            emotional: [],
            pacing: [],
            vibes: [],
            aesthetic: [],
            tropes: [],
            general: []
        };

        // Match tags in each category to existing ones
        for (const [category, tags] of Object.entries(categorizedTags)) {
            if (Array.isArray(tags)) {
                const matched = await matchOrCreateTags(tags.slice(0, 
                    category === 'emotional' || category === 'vibes' || category === 'tropes' ? 4 : 3
                ));
                processedCategories[category as keyof CategorizedTags] = matched.map(t => t.name);
            }
        }
        
        return processedCategories;
    } catch (error) {
        console.error("Error generating categorized tags:", error);
        // Return empty categories on error
        return {
            emotional: [],
            pacing: [],
            vibes: [],
            aesthetic: [],
            tropes: [],
            general: []
        };
    }
};
