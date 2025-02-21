// src/components/SortableItem.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Book {
  id: number;
  title: string;
  author: string;
}

interface SortableItemProps {
  id: number;
  book: Book;
  priority: number;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, book, priority }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: '1px solid #ccc',
    padding: '8px',
    margin: '4px 0',
    borderRadius: '4px',
    backgroundColor: 'white',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <h3>{book.title}</h3>
      <p>by {book.author}</p>
      <p>Priority: {priority}</p>
    </div>
  );
};

export default SortableItem;
