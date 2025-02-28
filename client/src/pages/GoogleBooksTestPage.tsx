import React, { useState } from 'react';
import { searchBooks, GoogleBook } from '../services/googleBooksService';

const GoogleBooksTestPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GoogleBook[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await searchBooks(query);
      setResults(data.items || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getISBN13 = (book: GoogleBook): string | undefined => {
    const identifiers = book.volumeInfo.industryIdentifiers;
    if (identifiers) {
      const isbn13 = identifiers.find((id) => id.type === 'ISBN_13');
      return isbn13 ? isbn13.identifier : undefined;
    }
    return undefined;
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Google Books API Test</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search for books..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      <ul className="space-y-4">
        {results.map((book) => (
          <li key={book.id} className="border-b pb-4">
            <h3 className="text-xl font-semibold">{book.volumeInfo.title}</h3>
            {book.volumeInfo.authors && (
              <p className="text-gray-600">by {book.volumeInfo.authors.join(', ')}</p>
            )}
            {book.volumeInfo.imageLinks?.thumbnail && (
              <img
                src={book.volumeInfo.imageLinks.thumbnail}
                alt={`Cover for ${book.volumeInfo.title}`}
                className="w-32 mb-2"
              />
            )}
            {book.volumeInfo.description && (
              <p>
                <strong>Description:</strong> {book.volumeInfo.description}
              </p>
            )}
            {getISBN13(book) && (
              <p>
                <strong>ISBN-13:</strong> {getISBN13(book)}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GoogleBooksTestPage;
