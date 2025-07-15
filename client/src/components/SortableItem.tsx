import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import BookCard, { BookCardProps } from './BookCard';
import '../styles/SortableItem.css';

interface SortableItemProps extends BookCardProps {
  id: number; // Unique identifier, e.g. the UserBook id
}

const SortableItem: React.FC<SortableItemProps> = ({ id, book, onClick, onDelete, priority }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id.toString() });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <BookCard book={book} onClick={onClick} onDelete={onDelete} priority={priority} />
    </div>
  );
};

export default SortableItem;
