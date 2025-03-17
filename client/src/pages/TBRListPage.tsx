import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookDetailsModal from '../components/BookDetailsModal';
import BookList from '../components/BookList';
import { UserBook } from '../types/book';
import { BookStatus } from '../enums/status.enum';

const TBRListPage: React.FC = () => {
  const [books, setBooks] = useState<UserBook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBook, setSelectedBook] = useState<UserBook | null>(null);
  const token = localStorage.getItem('token') || '';

  const fetchBooks = async () => {
    try {
      // Assume /api/books returns books with status "to-read" or "reading"
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

  useEffect(() => {
    fetchBooks();
  }, [token]);

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

  const handleCardClick = (book: UserBook) => {
    setSelectedBook(book);
  };

  const handleDelete = async (userBookId: number) => {
    try {
      await axios.delete(`/api/books/${userBookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks((prevBooks) => prevBooks.filter((b) => b.id !== userBookId));
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Could not delete this book.');
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
        <h2 className="text-3xl font-bold mb-4 text-center">My TBR List</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <BookList books={books} onCardClick={handleCardClick} draggable onReorder={handleReorder} onDelete={handleDelete} />
        )}
      </div>
      {selectedBook && (
        <BookDetailsModal
          book={selectedBook.book}
          userBookId={selectedBook.id}
          currentStatus={selectedBook.status}
          currentTags={selectedBook.userTags}
          onStatusChange={handleStatusChange}
          onClose={() => setSelectedBook(null)}
          onTagsChange={(newTags) => {
            setBooks((prevBooks) =>
              prevBooks.map((b) =>
                b.id === selectedBook.id ? { ...b, userTags: newTags } : b
              )
            );
          }}
        />
      )}
    </div>
  );
};

export default TBRListPage;