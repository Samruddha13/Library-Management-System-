import * as React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 dark:bg-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src="/logo.png"
              alt="Takshashil Library Logo"
              className="h-10 w-10 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <h1 className="text-2xl font-bold">
              Takshashil Library & Study Centre
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {user && (
              <>
                <span className="text-sm">Welcome, {user.name}</span>
                <span className="text-xs bg-blue-500 dark:bg-blue-700 px-2 py-1 rounded">
                  {user.role === "admin" ? "Admin" : "User"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-black dark:text-white border-white hover:bg-white/90">
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};