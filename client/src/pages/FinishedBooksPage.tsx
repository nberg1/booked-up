import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookList from '../components/BookList';
import { UserBook } from '../types/book';
import { BookStatus } from '../enums/status.enum';
import BookDetailsModal from '../components/BookDetailsModal';

const FinishedBooksPage: React.FC = () => {
  const [books, setBooks] = useState<UserBook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBook, setSelectedBook] = useState<UserBook | null>(null);
  const token = localStorage.getItem('token') || '';

  const fetchFinishedBooks = async () => {
    try {
      // Assume /api/books/finished returns books with status "read"
      const res = await axios.get('/api/books/finished', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(res.data);
    } catch (error) {
      console.error('Error fetching finished books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchFinishedBooks();
    }
  }, [token]);

  const handleCardClick = (book: UserBook) => {
    setSelectedBook(book);
  };

  // Callback when reordering occurs
  const handleReorder = async (updatedBooks: UserBook[]) => {
    setBooks(updatedBooks);
    const updates = updatedBooks.map((item, index) => ({
      id: item.id,
      priority: index + 1,
    }));
    try {
      await axios.put(
        '/api/books/order/update',
        { updates },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };


  const handleStatusChange = (newStatus: BookStatus) => {
    if (newStatus === BookStatus.READ) {
      // Remove the book from the TBR list if marked as "read"
      setBooks((prevBooks) => prevBooks.filter((b) => b.id !== selectedBook?.id));
    } else if (selectedBook) {
      // Otherwise, update the book's status
      setBooks((prevBooks) =>
        prevBooks.map((b) => (b.id === selectedBook.id ? { ...selectedBook, status: newStatus } : b))
      );
    }
    setSelectedBook(null);
  };
  
  return (
    <div className="min-h-screen bg-bookTan flex items-center justify-center p-4">
      <div className="bg-bookBeige text-bookBrown border border-bookBorder shadow-lg rounded-lg p-8 w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-bookBrown mb-4 text-center">Finished Books</h2>
        {loading ? (
            <p className="text-bookBrown">Loading...</p>
        ) : books.length === 0 ? (
            <p className="text-bookBrown text-center">No finished books found.</p>
        ) : (
          // Render without drag-and-drop
          <BookList books={books} onCardClick={handleCardClick} draggable onReorder={handleReorder} />
        )}
      </div>
      {selectedBook && (
        <BookDetailsModal
          book={selectedBook.book}
          userBookId={selectedBook.id}
          currentStatus={selectedBook.status}
          onStatusChange={handleStatusChange}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
};

export default FinishedBooksPage;