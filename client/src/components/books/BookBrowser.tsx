import * as React from 'react';
import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Book } from '@/types';
import { BookCard } from './BookCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export const BookBrowser = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [genreFilter, setGenreFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    const q = query(collection(db, 'books'), orderBy('title'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const booksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Book[];
      setBooks(booksData);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    let filtered = books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = genreFilter === 'all' || book.genre === genreFilter;
      return matchesSearch && matchesGenre;
    });

    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof Book];
      let bValue = b[sortBy as keyof Book];
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredBooks(filtered);
  }, [books, searchTerm, sortBy, sortOrder, genreFilter]);

  const genres = [...new Set(books.map(book => book.genre))];

  const handleBorrow = (bookId: string) => {
    // Implement borrow functionality
    console.log('Borrowing book:', bookId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <Input
          placeholder="Search books or authors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:flex-1"
        />
        <Select value={genreFilter} onValueChange={setGenreFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            {genres.map(genre => (
              <SelectItem key={genre} value={genre}>{genre}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="author">Author</SelectItem>
            <SelectItem value="genre">Genre</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="w-full md:w-auto"
        >
          {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map(book => (
          <BookCard
            key={book.id}
            book={book}
            onBorrow={handleBorrow}
          />
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No books found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};