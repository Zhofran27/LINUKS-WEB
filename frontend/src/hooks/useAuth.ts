'use client';

import { useState, useEffect } from 'react';
import { getUser, getToken, User } from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = getUser();
    const tokenData = getToken();
    setUser(userData);
    setToken(tokenData);
    setLoading(false);
  }, []);

  return { user, token, loading, isAuthenticated: !!user };
}