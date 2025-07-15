import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface TagWithCount {
  id: number;
  name: string;
  usageCount: number;
}

/**
 * Normalize a tag for consistent comparison
 * - Lowercase
 * - Trim whitespace
 * - Replace multiple spaces with single space
 * - Standardize common punctuation
 */
export function normalizeTag(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')           // Multiple spaces to single
    .replace(/[-_]/g, ' ')          // Hyphens/underscores to spaces
    .replace(/['']/g, "'")          // Standardize apostrophes
    .replace(/[""]/g, '"')          // Standardize quotes
    .replace(/\s*&\s*/g, ' and ')   // & to 'and'
    .replace(/\s+/g, ' ')           // Clean up any extra spaces
    .trim();
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,    // deletion
          dp[i][j - 1] + 1,    // insertion
          dp[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }

  return dp[m][n];
}

/**
 * Find similar tags in the database using fuzzy matching
 */
export function findSimilarTag(
  targetTag: string,
  existingTags: { id: number; name: string }[]
): { id: number; name: string } | null {
  const normalizedTarget = normalizeTag(targetTag);
  
  // First, try exact match (after normalization)
  for (const existing of existingTags) {
    if (normalizeTag(existing.name) === normalizedTarget) {
      return existing;
    }
  }

  // Then try fuzzy matching with Levenshtein distance
  const threshold = Math.max(3, Math.floor(normalizedTarget.length * 0.2)); // 20% of length or 3, whichever is larger
  let bestMatch: { tag: { id: number; name: string }; distance: number } | null = null;

  for (const existing of existingTags) {
    const distance = levenshteinDistance(normalizedTarget, normalizeTag(existing.name));
    if (distance <= threshold) {
      if (!bestMatch || distance < bestMatch.distance) {
        bestMatch = { tag: existing, distance };
      }
    }
  }

  return bestMatch?.tag || null;
}

/**
 * Get all existing tags from the database
 */
export async function getAllTags(): Promise<TagWithCount[]> {
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: {
          books: true,
          userBooks: true
        }
      }
    }
  });

  return tags.map(tag => ({
    id: tag.id,
    name: tag.name,
    usageCount: tag._count.books + tag._count.userBooks
  }));
}

/**
 * Get popular tags by category (for ChatGPT context)
 */
export async function getPopularTagsByCategory(limit: number = 10): Promise<Record<string, string[]>> {
  const allTags = await getAllTags();
  
  // Sort by usage
  const sortedTags = allTags.sort((a, b) => b.usageCount - a.usageCount);
  
  // Categorize tags (simple heuristic-based categorization)
  const categories: Record<string, string[]> = {
    emotional: [],
    pacing: [],
    vibes: [],
    aesthetic: [],
    tropes: [],
    general: []
  };

  const emotionalKeywords = ['cry', 'feel', 'heart', 'soul', 'comfort', 'emotional'];
  const pacingKeywords = ['slow', 'fast', 'page turner', 'binge', 'dnf', 'burn'];
  const vibesKeywords = ['character', 'hero', 'villain', 'morally', 'sunshine', 'grumpy'];
  const aestheticKeywords = ['dark', 'academia', 'gothic', 'cozy', 'vibes', 'aesthetic'];
  const tropeKeywords = ['enemies', 'lovers', 'fake', 'dating', 'chosen', 'found family'];

  for (const tag of sortedTags.slice(0, limit * 6)) {
    const lowerName = tag.name.toLowerCase();
    
    if (emotionalKeywords.some(kw => lowerName.includes(kw))) {
      if (categories.emotional.length < limit) categories.emotional.push(tag.name);
    } else if (pacingKeywords.some(kw => lowerName.includes(kw))) {
      if (categories.pacing.length < limit) categories.pacing.push(tag.name);
    } else if (vibesKeywords.some(kw => lowerName.includes(kw))) {
      if (categories.vibes.length < limit) categories.vibes.push(tag.name);
    } else if (aestheticKeywords.some(kw => lowerName.includes(kw))) {
      if (categories.aesthetic.length < limit) categories.aesthetic.push(tag.name);
    } else if (tropeKeywords.some(kw => lowerName.includes(kw))) {
      if (categories.tropes.length < limit) categories.tropes.push(tag.name);
    } else {
      if (categories.general.length < limit) categories.general.push(tag.name);
    }
  }

  return categories;
}

/**
 * Match generated tags to existing ones or create new ones
 */
export async function matchOrCreateTags(generatedTags: string[]): Promise<{ id: number; name: string; isNew: boolean }[]> {
  const existingTags = await prisma.tag.findMany();
  const results: { id: number; name: string; isNew: boolean }[] = [];

  for (const generatedTag of generatedTags) {
    // Try to find a similar existing tag
    const similarTag = findSimilarTag(generatedTag, existingTags);
    
    if (similarTag) {
      results.push({ ...similarTag, isNew: false });
    } else {
      // Create new tag if no match found
      const newTag = await prisma.tag.create({
        data: { name: generatedTag }
      });
      existingTags.push(newTag); // Add to cache for subsequent matches
      results.push({ id: newTag.id, name: newTag.name, isNew: true });
    }
  }

  return results;
}