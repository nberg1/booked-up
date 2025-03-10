import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { searchBooks, GoogleBook } from '../services/googleBooksService';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const [results, setResults] = useState<GoogleBook[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userTBR, setUserTBR] = useState<any[]>([]); // User's TBR list from backend
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const maxResults = 10;

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

  // Helper function to extract ISBN-13
  const getISBN13 = (book: GoogleBook): string | undefined => {
    const identifiers = book.volumeInfo.industryIdentifiers;
    if (identifiers) {
      const isbn13 = identifiers.find((id) => id.type === 'ISBN_13');
      return isbn13 ? isbn13.identifier : undefined;
    }
    return undefined;
  };

  // Function to fetch the user's TBR list from the backend
  const fetchUserTBR = async () => {
    try {
      const res = await axios.get('/api/books', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserTBR(res.data);
    } catch (error) {
      console.error('Error fetching TBR list:', error);
    }
  };

  const fetchResults = async (page: number) => {
    setLoading(true);
    try {
      const startIndex = (page - 1) * maxResults;
      const data = await searchBooks(query, maxResults, startIndex);
      setResults(data.items || []);
      setTotalItems(data.totalItems);
    } catch (error) {
      console.error('Error searching books:', error);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
    if (query) {
      setCurrentPage(1);
      fetchResults(1);
    }
  }, [query]);

  // Update page when currentPage changes
  useEffect(() => {
    if (query) {
      fetchResults(currentPage);
    }
  }, [currentPage, query]);

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
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(`"${book.volumeInfo.title}" added to your TBR!`);
      // Re-fetch the user's TBR list to update the UI
      await fetchUserTBR();
    } catch (error) {
      console.error('Error adding to TBR:', error);
      alert('Could not add this book to your TBR.');
    }
  };

// Check if a book is already in the user's TBR list based on ISBN
  const isBookInTBR = (book: GoogleBook): boolean => {
    const isbn = getISBN13(book);
    if (!isbn) return false;
    return userTBR.some((tbrItem) => tbrItem.book?.isbn === isbn);
  };

    // Pagination controls
  const totalPages = Math.ceil(totalItems / maxResults);
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

return (
    <div className="min-h-screen bg-bookTan p-4">
      <h2 className="text-3xl font-bold mb-4 text-bookBrown text-center">
        Search Results for "{query}"
      </h2>
      {loading ? (
        <p className="text-bookBrown text-center">Loading...</p>
      ) : results.length === 0 ? (
        <p className="text-bookBrown text-center">No results found.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {results.map((book) => (
              <li key={book.id} className="border-b pb-4">
                <h3 className="text-xl font-semibold text-bookBrown">{book.volumeInfo.title}</h3>
                {book.volumeInfo.authors && (
                  <p className="text-bookBrown/80">by {book.volumeInfo.authors.join(', ')}</p>
                )}
                {book.volumeInfo.imageLinks?.thumbnail && (
                  <img
                    src={book.volumeInfo.imageLinks.thumbnail}
                    alt={`Cover for ${book.volumeInfo.title}`}
                    className="w-32 mb-2"
                  />
                )}
                {book.volumeInfo.description && (
                  <p className="mb-2 text-bookBrown">
                    <strong>Description:</strong> {book.volumeInfo.description}
                  </p>
                )}
                {getISBN13(book) && (
                  <p className="mb-2 text-bookBrown">
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
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-bookAccent text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <div className="text-bookBrown">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-bookAccent text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResultsPage;
