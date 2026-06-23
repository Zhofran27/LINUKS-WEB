'use client';

import { useState, useEffect } from 'react';
import { getUser, User } from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
    setLoading(false);
  }, []);

  return { user, loading, isAuthenticated: !!user };
}