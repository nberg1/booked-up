import React, { useState } from 'react';
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
import axios from 'axios';

export interface UserBook {
  id: number;
  priority: number;
  book: {
    id: number;
    title: string;
    author: string;
    isbn: number;
    summary: string;
  };
}

interface TBRListProps {
  initialBooks: UserBook[];
  token: string;
}

const TBRList: React.FC<TBRListProps> = ({ initialBooks, token }) => {
  const [books, setBooks] = useState<UserBook[]>(initialBooks);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = books.findIndex((item) => item.id === active.id);
    const newIndex = books.findIndex((item) => item.id === over.id);
    const newBooks = arrayMove(books, oldIndex, newIndex);
    setBooks(newBooks);

    // Prepare updates: new priority is the index + 1
    const updates = newBooks.map((item, index) => ({
      id: item.id,
      priority: index + 1,
    }));

    // Send updates to backend
    try {
      await axios.put(
        '/api/books/order/update',
        { updates },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={books.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        {books.map((item) => (
          <SortableItem key={item.id} id={item.id} book={item.book} priority={item.priority} />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default TBRList;
