import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import BookCard from './BookCard';
import '../styles/SortableItem.css';
import { Book } from '../types/book';

interface SortableItemProps {
  id: number; // Unique identifier for dnd-kit (usually the same as the userBook id)
  book: Book;
  priority: number;
  onClick?: () => void;
  onDelete?: () => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, book, priority, onClick, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <BookCard book={book} priority={priority} onClick={onClick} onDelete={onDelete} />
    </div>
  );
};

export default SortableItem;
