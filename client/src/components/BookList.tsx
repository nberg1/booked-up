import React from 'react';
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import SortableItem from './SortableItem';
import { UserBook } from '../types/book';

interface BookListProps {
  books: UserBook[];
  onCardClick: (book: UserBook) => void;
  onDelete?: (userBookId: number) => void;
  /** Set draggable to true for pages that support reordering (TBR) */
  draggable?: boolean;
  /** Optional callback that fires when the order changes */
  onReorder?: (updatedBooks: UserBook[]) => void;
}

const BookList: React.FC<BookListProps> = ({
  books,
  onCardClick,
  onDelete,
  draggable = true,
  onReorder,
}) => {

  // Draggable version using dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = books.findIndex((item) => item.id.toString() === active.id);
    const newIndex = books.findIndex((item) => item.id.toString() === over.id);
    const newBooks = arrayMove(books, oldIndex, newIndex);
    if (onReorder) {
      onReorder(newBooks);
    }
  };
  
  // If not draggable, render a simple grid of covers
  if (!draggable) {
    return (
      <div className="flex flex-wrap gap-4 justify-center">
        {books.map((item) => (
          <div key={item.id} onClick={() => onCardClick(item)} className="cursor-pointer">
            {item.book.cover ? (
              <img
                src={item.book.cover}
                alt={item.book.title}
                className="w-32 rounded shadow"
              />
            ) : (
              <div className="w-32 h-48 bg-gray-300 flex items-center justify-center rounded shadow">
                <span className="text-gray-700">No Cover</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={books.map((item) => item.id.toString())} strategy={verticalListSortingStrategy}>
        <div className="flex flex-wrap gap-4 justify-center">
          {books.map((item) => (
            <SortableItem
              key={item.id}
              id={item.id}
              book={item.book}
              priority={item.priority}
              onClick={() => onCardClick(item)}
              onDelete={onDelete ? () => onDelete(item.id) : undefined}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default BookList;
