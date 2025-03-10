import axios from 'axios';

const GOOGLE_BOOKS_API_BASE = 'https://www.googleapis.com/books/v1/volumes';

export interface IndustryIdentifier {
  type: string;
  identifier: string;
}

export interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    industryIdentifiers?: IndustryIdentifier[];
    imageLinks?: {
      thumbnail: string;
    };
    // Additional fields can be added if needed.
  };
}

export interface GoogleBooksResponse {
  totalItems: number;
  items: GoogleBook[];
}

/**
 * searchBooks
 * @param query - The search query.
 * @param maxResults - Maximum number of results per page (default 10).
 * @param startIndex - The index of the first result to return.
 * @returns A promise that resolves to the search results.
 */
export async function searchBooks(
  query: string,
  maxResults = 10,
  startIndex = 0
): Promise<GoogleBooksResponse> {
  const apiKey = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY;
  try {
    const response = await axios.get(GOOGLE_BOOKS_API_BASE, {
      params: {
        q: query,
        key: apiKey,
        maxResults,
        startIndex,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching from Google Books API:', error);
    throw error;
  }
}