import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { User } from '../types/user';

interface AuthContextProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  isAuthLoading: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/api/users/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          // If valid, set the auth state accordingly.
          if (response.data && response.data.user.id) {
            setIsLoggedIn(true);
            setUser({id: response.data.user.id, name: response.data.user.name, email: response.data.user.email});
          } else {
            setIsLoggedIn(false);
            setUser(null);
            localStorage.removeItem('token');
          }
        } catch (error) {
          setIsLoggedIn(false);
          localStorage.removeItem('token');
        }
      }
      setIsAuthLoading(false);
    };

    verifyToken();
  }, []);

  // Listen for localStorage changes, if needed.
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, isAuthLoading, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};