import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { Book } from '../types/book';
import { BookStatus } from '../enums/status.enum';
import EditTagModal from './EditTagModal'; // Updated to use our new EditTagModal

interface BookDetailsModalProps {
  book: Book;
  userBookId: number; // The unique ID of the user's TBR entry (UserBook)
  currentStatus: BookStatus; // e.g. "to-read", "reading", "read"
  currentTags?: any[]; // Could be an array of strings or objects
  onTagsChange?: (newTags: string[]) => void;
  onStatusChange: (newStatus: BookStatus) => void;
  onClose: () => void;  
}

const BookDetailsModal: React.FC<BookDetailsModalProps> = ({
  book,
  userBookId,
  currentStatus,
  currentTags = [],
  onTagsChange,
  onStatusChange,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<BookStatus>(currentStatus);
  const [showEditTags, setShowEditTags] = useState(false);
  // Create local state for tags that can be updated after editing.
  const [localTags, setLocalTags] = useState<string[]>([]);

  useEffect(() => {
    const tagNames = (currentTags || [])
      .filter((tagItem: any) => tagItem !== undefined && tagItem !== null)
      .map((tagItem: any) => {
        // If tagItem is a string, return it directly.
        if (typeof tagItem === 'string') return tagItem;
        // Otherwise, try to extract the name from tagItem.tag or tagItem.
        return tagItem.tag?.name || tagItem.name || '';
      })
      .filter((name: string) => name !== '');
    setLocalTags(tagNames);
  }, [currentTags]);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as BookStatus;
    setSelectedStatus(newStatus);
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/books/status/${userBookId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onStatusChange(newStatus);
    } catch (error: any) {
      console.error('Error updating status:', error.response || error);
      alert('Could not update status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-bookBeige text-bookBrown rounded-lg shadow-xl p-6 relative max-w-lg w-full max-h-[80vh] overflow-y-auto">
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
          <h2 className="text-2xl font-bold mb-2 text-center">{book.title}</h2>
          <p className="text-lg mb-2 text-center">by {book.author}</p>
          {/* Display the current (user's) tags */}
          <div className="mb-4 w-full">
            {localTags.length > 0 ? (
              <div className="flex flex-wrap gap-2 justify-center">
                {localTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-bookAccent text-white rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-bookBrown/70 text-center">No tags added.</p>
            )}
          </div>
          {book.description && (
            <div className="text-sm text-center whitespace-pre-line">
              {book.description}
            </div>
          )}
          <label className="mb-2 font-medium">Status:</label>

          <div className="flex flex-row items-center">
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              disabled={loading}
              className="px-3 py-2 border border-bookBorder rounded focus:outline-none focus:ring-2 focus:ring-bookAccent"
            >
              <option value={BookStatus.TO_READ}>To Read</option>
              <option value={BookStatus.READING}>Reading</option>
              <option value={BookStatus.READ}>Read</option>
            </select>
            <button
              onClick={() => setShowEditTags(true)}
              className="px-4 py-2 bg-bookAccent text-white rounded hover:bg-bookAccentHover transition"
            >
              Edit Tags
            </button>
          </div>
        </div>
      </div>
      {showEditTags && (
        <EditTagModal
          bookTitle={book.title}
          bookAuthor={book.author}
          bookDescription={book.description}
          currentTags={localTags}
          globalTags={[]} 
          onSave={async (newTags) => {
            try {
              // Sanitize the tags array: remove any undefined, null, or empty strings.
              const sanitizedTags = newTags.filter(
                (tag) => tag !== undefined && tag !== null && tag.trim() !== ''
              );
              const token = localStorage.getItem('token');
              await axios.put(
                `/api/books/${userBookId}/tags`,
                { tags: sanitizedTags },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              // Update the parent state and local state with sanitized tags.
              if (onTagsChange) {
                onTagsChange(sanitizedTags);
              }
              setLocalTags(sanitizedTags);
            } catch (error) {
              console.error('Error updating tags:', error);
              alert('Could not update tags. Please try again.');
            }
            setShowEditTags(false);
          }}
          onClose={() => setShowEditTags(false)}
        />
      )}
    </div>
  );
};

export default BookDetailsModal;
