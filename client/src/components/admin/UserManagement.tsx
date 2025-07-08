import * as React from 'react';
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
        };
      }) as User[];
      setUsers(usersData);
    });

    return unsubscribe;
  }, []);

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isActive: !isActive,
      });
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const makeAdmin = async (userId: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: 'admin',
      });
    } catch (error) {
      console.error('Error making user admin:', error);
    }
  };

  const removeAdmin = async (userId: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: 'user',
      });
    } catch (error) {
      console.error('Error removing admin:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">User Management</h3>
        <div className="text-sm text-gray-600">
          <p>To create the first admin: Register a user account, then manually change their role to 'admin' in Firebase Console</p>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={user.isActive}
                      onCheckedChange={() => toggleUserStatus(user.id, user.isActive)}
                    />
                    <span className="text-sm">
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {user.role === 'user' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => makeAdmin(user.id)}
                      >
                        Make Admin
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeAdmin(user.id)}
                      >
                        Remove Admin
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};