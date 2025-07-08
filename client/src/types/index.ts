export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  imageUrl: string;
  totalCopies: number;
  availableCopies: number;
  description?: string;
  isbn?: string;
  publishedDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
  isActive: boolean;
}

export interface BorrowRecord {
  id: string;
  userId: string;
  bookId: string;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'borrowed' | 'returned' | 'overdue';
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}