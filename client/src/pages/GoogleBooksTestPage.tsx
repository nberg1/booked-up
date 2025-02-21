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
      console.error(error);
    } finally {
      setLoading(false);
    }
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
          <li key={book.id}>
            <strong>{book.volumeInfo.title}</strong>
            {book.volumeInfo.authors && <span> by {book.volumeInfo.authors.join(', ')}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GoogleBooksTestPage;
