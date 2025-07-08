import * as React from 'react';
import { Book } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface BookCardProps {
  book: Book;
  onBorrow?: (bookId: string) => void;
  onEdit?: (book: Book) => void;
  onDelete?: (bookId: string) => void;
}

export const BookCard = ({ book, onBorrow, onEdit, onDelete }: BookCardProps) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-3 overflow-hidden">
          <img
            src={book.imageUrl || '/placeholder-book.jpg'}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        </div>
        <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
        <CardDescription>by {book.author}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <Badge variant="secondary">{book.genre}</Badge>
          <div className="text-sm text-gray-600">
            <div>Available: {book.availableCopies}/{book.totalCopies}</div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          {!isAdmin && book.availableCopies > 0 && (
            <Button onClick={() => onBorrow?.(book.id)} className="flex-1">
              Borrow
            </Button>
          )}
          {isAdmin && (
            <>
              <Button variant="outline" onClick={() => onEdit?.(book)} className="flex-1">
                Edit
              </Button>
              <Button variant="destructive" onClick={() => onDelete?.(book.id)} className="flex-1">
                Delete
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};