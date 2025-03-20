import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookDetailsModal from '../components/BookDetailsModal';
import BookList from '../components/BookList';
import { UserBook } from '../types/book';
import { BookStatus } from '../enums/status.enum';
import MoreTagsModal from '../components/MoreTagsModal';

const TBRListPage: React.FC = () => {
  const [books, setBooks] = useState<UserBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<UserBook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBook, setSelectedBook] = useState<UserBook | null>(null);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [showMoreTagsModal, setShowMoreTagsModal] = useState<boolean>(false);
  const token = localStorage.getItem('token') || '';
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // Adjust threshold as needed
    };
    window.addEventListener('resize', handleResize);
    // Call once on mount
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchBooks = async () => {
    try {
      // Assume /api/books returns books with status "to-read" or "reading"
      const res = await axios.get('/api/books', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(res.data);
      setFilteredBooks(res.data);
    } catch (error) {
      console.error('Error fetching TBR list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchBooks();
    }
  }, [token]);

  // Update filteredBooks whenever filterTag or books change.
  useEffect(() => {
    if (filterTags.length === 0) {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(book => {
        // Normalize the book's userTags into lower-case tag names.
        const bookTagNames = (book.userTags || []).map((ut: any) => {
          if (typeof ut === 'string') return ut.toLowerCase();
          return ut.tag?.name?.toLowerCase() || ut.name?.toLowerCase() || '';
        });
        // Show the book if it has at least one tag that matches any filter.
        return filterTags.some(filter => bookTagNames.includes(filter.toLowerCase()));
      });
      setFilteredBooks(filtered);
    }
  }, [filterTags, books]);

  // Compute available tags and their counts from all books.
  const tagCountMap = new Map<string, number>();
  books.forEach(book => {
    (book.userTags || []).forEach((ut: any) => {
      const tagName =
        typeof ut === 'string'
          ? ut
          : (ut.tag?.name || ut.name || '');
      if (tagName) {
        tagCountMap.set(tagName, (tagCountMap.get(tagName) || 0) + 1);
      }
    });
  });
  const allAvailableTags = Array.from(tagCountMap.entries()).map(([tag, count]) => ({ tag, count }));
  // Sort descending by count.
  allAvailableTags.sort((a, b) => b.count - a.count);
  const inlineTagCount = isMobile ? 4 : 7;
  const inlineTags = allAvailableTags.slice(0, inlineTagCount);

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
    <div className="min-h-screen bg-bookTan flex flex-col items-center p-4">
      <div className="bg-bookBeige text-bookBrown border border-bookBorder shadow-lg rounded-lg p-8 w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-4 text-center">My TBR List</h2>
        {/* Filter UI */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Filter by Tag:</h3>
          <div className="flex flex-wrap gap-2">
            {inlineTags.map((item, index) => {
              const isSelected = filterTags.some(
                t => t.toLowerCase() === item.tag.toLowerCase()
              );
              return (
                <button
                  key={index}
                  onClick={() => {
                    // Toggle the tag on or off:
                    if (isSelected) {
                      setFilterTags(filterTags.filter(t => t.toLowerCase() !== item.tag.toLowerCase()));
                    } else {
                      setFilterTags([...filterTags, item.tag]);
                    }
                  }}
                  className={`px-2 py-1 rounded-full border ${
                    isSelected
                      ? 'bg-bookAccent text-white'
                      : 'bg-white text-bookBrown border-bookBorder'
                  }`}
                >
                  {item.tag} ({item.count})
                </button>
              );
            })}
            {allAvailableTags.length > inlineTagCount && (
              <button
                onClick={() => setShowMoreTagsModal(true)}
                className="px-2 py-1 rounded-full border bg-white font-semibold text-bookBrown border-bookBorder"
              >
                + More Tags
              </button>
            )}
            {filterTags.length > 0 && (
              <button
                onClick={() => setFilterTags([])}
                className="px-2 py-1 rounded-full border bg-red-500 text-white"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <BookList
            books={filteredBooks}
            onCardClick={handleCardClick}
            draggable
            onReorder={handleReorder}
            onDelete={handleDelete}
          />
        )}
      </div>
      {selectedBook && (
        <BookDetailsModal
          book={selectedBook.book}
          userBookId={selectedBook.id}
          currentStatus={selectedBook.status}
          currentTags={selectedBook.userTags || []}  // Pass them directly!
          onStatusChange={handleStatusChange}
          onClose={() => setSelectedBook(null)}
          onTagsChange={(newTags: string[]) => {
            // Update the parent books state with the new tags for the selected book.
            setBooks((prevBooks) =>
              prevBooks.map((book) =>
                book.id === selectedBook.id ? { ...book, userTags: newTags } : book
              )
            );
            // Also update the local selectedBook state.
            setSelectedBook({ ...selectedBook, userTags: newTags });
          }}
        />
      )}
      {showMoreTagsModal && (
        <MoreTagsModal
          availableTags={allAvailableTags}
          initialSelectedTags={filterTags}
          onApply={(selected) => {
            setFilterTags(selected);
            setShowMoreTagsModal(false);
          }}
          onClose={() => setShowMoreTagsModal(false)}
        />
      )}
    </div>
  );
};

export default TBRListPage;