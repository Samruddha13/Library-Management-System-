import * as React from 'react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookManagement } from './BookManagement';
import { UserManagement } from './UserManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="Takshashil Library Logo" 
            className="h-8 w-8 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        </div>
      </div>

      <Tabs defaultValue="books" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="books">Book Management</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="books" className="space-y-4">
          <BookManagement />
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};