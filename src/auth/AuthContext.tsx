import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: number;
  username: string;
  isAdmin?: boolean;
}

interface AuthContextValue {
  user: User | null;
  setUser: (u: User | null) => void;
  logout: () => Promise<void>;
  checkStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const checkStatus = async () => {
    try {
      const res = await fetch('/api/users/status', { credentials: 'include' });
      if (!res.ok) return setUser(null);
      const data = await res.json().catch(() => ({}));
      if (data && data.loggedIn) {
        setUser(data.user || null);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to check session status', err);
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      const res = await fetch('/api/users/logout', { method: 'POST', credentials: 'include' });
      if (res.ok) {
        setUser(null);
      } else {
        console.warn('Logout failed');
      }
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout, checkStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
