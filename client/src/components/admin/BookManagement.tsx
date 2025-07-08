import * as React from 'react';
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Book } from '@/types';
import { BookCard } from '../books/BookCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const BookManagement = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    imageUrl: '',
    totalCopies: 1,
    availableCopies: 1,
    description: '',
    isbn: '',
    publishedDate: '',
  });

  useEffect(() => {
    const q = query(collection(db, 'books'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const booksData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt),
        };
      }) as Book[];
      setBooks(booksData);
    });

    return unsubscribe;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const bookData = {
      ...formData,
      totalCopies: Number(formData.totalCopies),
      availableCopies: Number(formData.availableCopies),
      updatedAt: serverTimestamp(),
    };

    try {
      if (editingBook) {
        await updateDoc(doc(db, 'books', editingBook.id), bookData);
      } else {
        await addDoc(collection(db, 'books'), {
          ...bookData,
          createdAt: serverTimestamp(),
        });
      }
      resetForm();
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      imageUrl: book.imageUrl || '',
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      description: book.description || '',
      isbn: book.isbn || '',
      publishedDate: book.publishedDate || '',
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (bookId: string) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteDoc(doc(db, 'books', bookId));
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      genre: '',
      imageUrl: '',
      totalCopies: 1,
      availableCopies: 1,
      description: '',
      isbn: '',
      publishedDate: '',
    });
    setEditingBook(null);
    setIsAddDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Book Management</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Book</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Input
                    id="genre"
                    value={formData.genre}
                    onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalCopies">Total Copies</Label>
                  <Input
                    id="totalCopies"
                    type="number"
                    min="1"
                    value={formData.totalCopies}
                    onChange={(e) => setFormData(prev => ({ ...prev, totalCopies: Number(e.target.value) }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availableCopies">Available Copies</Label>
                  <Input
                    id="availableCopies"
                    type="number"
                    min="0"
                    value={formData.availableCopies}
                    onChange={(e) => setFormData(prev => ({ ...prev, availableCopies: Number(e.target.value) }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    value={formData.isbn}
                    onChange={(e) => setFormData(prev => ({ ...prev, isbn: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publishedDate">Published Date</Label>
                  <Input
                    id="publishedDate"
                    type="date"
                    value={formData.publishedDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, publishedDate: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editingBook ? 'Update' : 'Add'} Book</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map(book => (
          <BookCard
            key={book.id}
            book={book}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};