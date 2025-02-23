import React from 'react';
import '../styles/BookCard.css';

interface Book {
  id: number;
  isbn: number;
  title: string;
  author: string;
  summary: string;
  // additional fields if needed
  // reviews?
  // ratings?
  // spice scale?
}

interface BookCardProps {
  book: Book;
  priority: number;
}

const BookCard: React.FC<BookCardProps> = ({ book, priority }) => {
  return (
    <div className="book-card">
      <h3>{book.title}</h3>
      <p>by {book.author}</p>
      <p>Priority: {priority}</p>
    </div>
  );
};

export default BookCard;

