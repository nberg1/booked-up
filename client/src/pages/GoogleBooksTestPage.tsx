import React, { useState } from 'react';
import { searchBooks, GoogleBook } from '../services/googleBooksService';

const GoogleBooksTestPage: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<GoogleBook[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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

  // Helper to extract ISBN-13 from industryIdentifiers, if available.
  const getISBN13 = (book: GoogleBook): string | undefined => {
    const identifiers = book.volumeInfo.industryIdentifiers;
    if (identifiers) {
      const isbn13 = identifiers.find((id) => id.type === 'ISBN_13');
      return isbn13 ? isbn13.identifier : undefined;
    }
    return undefined;
  };

  return (
    <div>
      <h2>Google Books API Test</h2>
      <input
        type="text"
        placeholder="Search for books..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>
      <ul>
        {results.map((book) => (
          <li key={book.id} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
            <h3>{book.volumeInfo.title}</h3>
            {book.volumeInfo.imageLinks?.thumbnail && (
              <img
                src={book.volumeInfo.imageLinks.thumbnail}
                alt={`Cover for ${book.volumeInfo.title}`}
                style={{ maxWidth: '120px', marginBottom: '8px' }}
              />
            )}
            {book.volumeInfo.authors && <p>by {book.volumeInfo.authors.join(', ')}</p>}
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
