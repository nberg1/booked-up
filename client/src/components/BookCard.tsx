import React from 'react';
import '../styles/BookCard.css';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Book } from '../types/book';

export interface BookCardProps {
  book: Book;
  priority: number;
  onClick?: () => void;
  onDelete?: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick, onDelete }) => {
  return (
    <div className="relative cursor-pointer" onClick={onClick}>
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
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent opening modal when deleting
            onDelete();
          }}
          className="absolute top-1 right-1 p-1 bg-red-500 rounded-full hover:bg-red-600"
        >
          <TrashIcon className="h-4 w-4 text-white" />
        </button>
      )}
    </div>
  );
};

export default BookCard;
