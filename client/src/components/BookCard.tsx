import React from 'react';
import '../styles/BookCard.css';

interface Book {
  id: number;
  isbn: number;
  title: string;
  author: string;
  description: string;
  cover: string;
  // additional fields if needed
  // reviews?
  // ratings?
  // spice scale?
}

interface BookCardProps {
  book: Book;
  priority: number;
  onClick?: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  return (
    <div onClick={onClick} className="cursor-pointer">
      {book.cover ? (
        <img
          src={book.cover}
          alt={`Cover for ${book.title}`}
          className="w-32 h-auto rounded shadow"
        />
      ) : (
        <div className="w-32 h-48 bg-gray-300 flex items-center justify-center rounded shadow">
          <span className="text-gray-700">No Cover</span>
        </div>
      )}
    </div>
  );
};

export default BookCard;

