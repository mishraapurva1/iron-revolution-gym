import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api, getAuthToken, setAuthToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  demoLogin: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    try {
      if (!getAuthToken()) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      const res = await api.getMe();
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        logout();
      }
    } catch (err) {
      console.warn('Session verification failed, logging out:', err);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password });
      if (res.success && res.token) {
        setAuthToken(res.token);
        setToken(res.token);
        setUser(res.user);
      } else {
        throw new Error(res.message || 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (targetRole: UserRole) => {
    const creds: Record<UserRole, { e: string; p: string }> = {
      ADMIN: { e: 'admin@ironrevolution.com', p: 'Admin@123' },
      TRAINER: { e: 'trainer@ironrevolution.com', p: 'Trainer@123' },
      MEMBER: { e: 'member@ironrevolution.com', p: 'Member@123' },
    };

    const { e, p } = creds[targetRole];
    await login(e, p);
  };

  const logout = () => {
    setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
