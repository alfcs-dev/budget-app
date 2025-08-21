import React, { useState, useEffect, useCallback } from 'react';
import { User } from '@budget-manager/database';
import { AuthContext, AuthContextType } from './AuthContext';
import { userApi, getApiErrorMessage } from '../lib/api-client';

const AUTH_STORAGE_KEY = 'budget-app-user';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Failed to load user from storage:', error);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    try {
      setIsLoading(true);
      
      // Try to get existing users and find matching email
      const existingUsers = await userApi.getAll();
      const existingUser = existingUsers.find(u => u.email === email);
      
      if (existingUser) {
        // In real app, you'd verify password hash here
        setUser(existingUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(existingUser));
      } else {
        throw new Error('User not found. Please register first.');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const userData = { email, password };
      const newUser = await userApi.create(userData);
      
      setUser(newUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    } catch (error) {
      console.error('Registration error:', error);
      const message = getApiErrorMessage(error);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
