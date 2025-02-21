import axios from 'axios';

const GOOGLE_BOOKS_API_BASE = 'https://www.googleapis.com/books/v1/volumes';

export interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail: string;
    };
    [key: string]: any;
  };
}

export interface GoogleBooksResponse {
  totalItems: number;
  items: GoogleBook[];
}

/**
 * searchBooks
 * @param query - The search query (e.g., book title, author, etc.)
 * @param maxResults - Maximum number of results (default: 10)
 * @returns A promise that resolves to the search results.
 */
export async function searchBooks(query: string, maxResults = 10): Promise<GoogleBooksResponse> {
  const apiKey = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY;
  try {
    const response = await axios.get(GOOGLE_BOOKS_API_BASE, {
      params: {
        q: query,
        key: apiKey,
        maxResults,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching from Google Books API:', error);
    throw error;
  }
}
