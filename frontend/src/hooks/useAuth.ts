'use client';

import { useSyncExternalStore } from 'react';

type AuthUser = {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
};

let lastStoredUser: string | null = null;
let lastUser: AuthUser | null = null;

export function useAuth() {
  const user = useSyncExternalStore(subscribeToAuth, getAuthSnapshot, getServerSnapshot);

  return { user, loading: false };
}

function subscribeToAuth(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange);

  return () => {
    window.removeEventListener('storage', onStoreChange);
  };
}

function getAuthSnapshot() {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  if (!token || !storedUser) {
    lastStoredUser = null;
    lastUser = null;
    return null;
  }

  if (storedUser === lastStoredUser) {
    return lastUser;
  }

  try {
    lastStoredUser = storedUser;
    lastUser = JSON.parse(storedUser) as AuthUser;
    return lastUser;
  } catch {
    localStorage.removeItem('user');
    lastStoredUser = null;
    lastUser = null;
    return null;
  }
}

function getServerSnapshot() {
  return null;
}
