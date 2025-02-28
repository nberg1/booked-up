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
    <div onClick={onClick} className="cursor-pointer p-4 border border-bookBorder rounded bg-bookBeige hover:shadow-md transition">
      {book.cover && (
        <img
          src={book.cover}
          alt={`Cover for ${book.title}`}
          className="w-32 mb-2"
        />
      )}
      <h3 className="text-xl font-semibold">{book.title}</h3>
      <p className="text-bookBrown/80">by {book.author}</p>
    </div>
  );
};

export default BookCard;

