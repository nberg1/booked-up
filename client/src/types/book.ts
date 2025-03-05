import { BookStatus } from "../enums/status.enum";

export interface Book {
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

export interface UserBook {
  id: number;
  priority: number;
  status: BookStatus;
  book: Book;
}
