import * as React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminDashboard } from '../admin/AdminDashboard';
import { BookBrowser } from '../books/BookBrowser';

export const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {user.role === 'admin' ? <AdminDashboard /> : <BookBrowser />}
    </div>
  );
};