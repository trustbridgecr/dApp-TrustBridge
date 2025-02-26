'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, AuthState, User, UserRole } from '@/@types/auth';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    // Check localStorage for existing session
    const address = localStorage.getItem('walletAddress');
    const role = localStorage.getItem('userRole') as UserRole;
    const name = localStorage.getItem('walletName');

    if (address && role && name) {
      setState({
        user: { address, role, name },
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = (address: string, name: string, role: UserRole) => {
    localStorage.setItem('walletAddress', address);
    localStorage.setItem('userRole', role);
    localStorage.setItem('walletName', name);

    setState({
      user: { address, role, name },
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('userRole');
    localStorage.removeItem('walletName');

    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateRole = (role: UserRole) => {
    if (state.user) {
      const updatedUser: User = { ...state.user, role };
      localStorage.setItem('userRole', role);
      setState(prev => ({ ...prev, user: updatedUser }));
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateRole }}>
      {children}
    </AuthContext.Provider>
  );
}; 