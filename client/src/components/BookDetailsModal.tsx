import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface BookDetailsModalProps {
  book: {
    title: string;
    author: string;
    description?: string;
    cover: string;
  };
  onClose: () => void;
}

const BookDetailsModal: React.FC<BookDetailsModalProps> = ({ book, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-bookBeige text-bookBrown rounded-lg shadow-xl p-6 relative max-w-lg w-full">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-bookBrown hover:text-bookAccent"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <div className="flex flex-col items-center">
          {book.cover && (
            <img
              src={book.cover}
              alt={`Cover for ${book.title}`}
              className="w-32 mb-4"
            />
          )}
          <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
          <p className="text-lg mb-2">by {book.author}</p>
          {book.description && (
            <p className="text-sm text-center">{book.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetailsModal;
