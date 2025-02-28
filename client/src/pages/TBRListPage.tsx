import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TBRList, { UserBook } from '../components/TBRList';
import BookDetailsModal from '../components/BookDetailsModal';

const TBRListPage: React.FC = () => {
  const [books, setBooks] = useState<UserBook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBook, setSelectedBook] = useState<UserBook | null>(null);
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get('/api/books', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooks(res.data);
      } catch (error) {
        console.error('Error fetching TBR list:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [token]);

  const handleCardClick = (book: UserBook) => {
    setSelectedBook(book);
  };

  return (
    <div className="min-h-screen bg-bookTan flex items-center justify-center p-4">
      <div className="bg-bookBeige text-bookBrown border border-bookBorder shadow-lg rounded-lg p-8 w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-4 text-center">My TBR List</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <TBRList initialBooks={books} token={token} onCardClick={handleCardClick} />
        )}
      </div>
      {selectedBook && (
        <BookDetailsModal
          book={selectedBook.book}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
};

export default TBRListPage;
