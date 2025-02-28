import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { searchBooks, GoogleBook } from '../services/googleBooksService';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const [results, setResults] = useState<GoogleBook[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Retrieve token from localStorage (or from your auth context)
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    if (query) {
      setLoading(true);
      searchBooks(query)
        .then((data) => {
          setResults(data.items || []);
        })
        .catch((error) => {
          console.error('Error searching books:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [query]);

    // Helper function to extract ISBN-10
  const getISBN10 = (book: GoogleBook): string | undefined => {
    const identifiers = book.volumeInfo.industryIdentifiers;
    if (identifiers) {
      const isbn10 = identifiers.find((id) => id.type === 'ISBN_10');
      return isbn10 ? isbn10.identifier : undefined;
    }
    return undefined;
  };

  // Helper function to extract ISBN-13
  const getISBN13 = (book: GoogleBook): string | undefined => {
    const identifiers = book.volumeInfo.industryIdentifiers;
    if (identifiers) {
      const isbn13 = identifiers.find((id) => id.type === 'ISBN_13');
      return isbn13 ? isbn13.identifier : undefined;
    }
    return undefined;
  };

  // Function to add a book to the TBR list using your existing backend
  const handleAddToTBR = async (book: GoogleBook) => {
    try {
      // Adjust payload to match what your createBook controller expects
      const payload = {
        title: book.volumeInfo.title,
        author: book.volumeInfo.authors?.join(', '),
        description: book.volumeInfo.description,
        isbn: getISBN13(book),
        cover: book.volumeInfo.imageLinks?.thumbnail
        // Optionally add description, isbn, etc.
      };

      await axios.post('/api/books', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(`"${book.volumeInfo.title}" added to your TBR!`);
    } catch (error) {
      console.error('Error adding to TBR:', error);
      alert('Could not add this book to your TBR.');
    }
  };

  return (
    <div className="min-h-screen bg-bookTan p-4">
      <h2 className="text-2xl font-bold text-bookBrown mb-4">
        Search Results for "{query}"
      </h2>
      {loading ? (
        <p className="text-bookBrown">Loading...</p>
      ) : results.length === 0 ? (
        <p className="text-bookBrown">No results found.</p>
      ) : (
        <ul className="space-y-4">
          {results.map((book) => (
            <li
              key={book.id}
              className="bg-bookBeige text-bookBrown p-4 rounded border border-bookBorder"
            >
              <h3 className="text-xl font-semibold">
                {book.volumeInfo.title}
              </h3>
              {book.volumeInfo.authors && (
                <p className="text-bookBrown/80">
                  by {book.volumeInfo.authors.join(', ')}
                </p>
              )}
              {book.volumeInfo.imageLinks?.thumbnail && (
                <img
                  src={book.volumeInfo.imageLinks.thumbnail}
                  alt={`Cover for ${book.volumeInfo.title}`}
                  className="w-32 mb-2"
                />
              )}
              {book.volumeInfo.description && (
                <p className="mb-2">
                  <strong>Description:</strong> {book.volumeInfo.description}
                </p>
              )}
              {getISBN10(book) && (
                <p className="mb-2">
                  <strong>ISBN-10:</strong> {getISBN10(book)}
                </p>
              )}
              {getISBN13(book) && (
                <p className="mb-2">
                  <strong>ISBN-13:</strong> {getISBN13(book)}
                </p>
              )}
              <button
                onClick={() => handleAddToTBR(book)}
                className="mt-2 px-3 py-1 bg-bookAccent text-white rounded hover:bg-bookAccentHover transition duration-200"
              >
                Add to TBR
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResultsPage;
