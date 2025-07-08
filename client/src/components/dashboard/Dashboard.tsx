import * as React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminDashboard } from '../admin/AdminDashboard';
import { BookBrowser } from '../books/BookBrowser';

export const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {user.role === 'admin' ? <AdminDashboard /> : <BookBrowser />}
    </div>
  );
};