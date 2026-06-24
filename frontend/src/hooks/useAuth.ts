'use client';

import { useSyncExternalStore } from 'react';
import { getToken, getUser, User } from '@/lib/auth';

type AuthState = {
  user: User | null;
  token: string | null;
};

let lastToken: string | null = null;
let lastStoredUser: string | null = null;
let lastSnapshot: AuthState = { user: null, token: null };

function subscribeToAuth(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener('auth-change', onStoreChange);

  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener('auth-change', onStoreChange);
  };
}

function getAuthSnapshot(): AuthState {
  const token = getToken();
  const storedUser = localStorage.getItem('user');

  if (!token || !storedUser) {
    lastToken = null;
    lastStoredUser = null;
    lastSnapshot = { user: null, token: null };
    return lastSnapshot;
  }

  if (token === lastToken && storedUser === lastStoredUser) {
    return lastSnapshot;
  }

  const user = getUser();
  lastToken = token;
  lastStoredUser = storedUser;
  lastSnapshot = { user, token };

  return lastSnapshot;
}

function getServerSnapshot(): AuthState {
  return { user: null, token: null };
}

export function useAuth() {
  const auth = useSyncExternalStore(
    subscribeToAuth,
    getAuthSnapshot,
    getServerSnapshot,
  );

  return {
    user: auth.user,
    token: auth.token,
    loading: false,
    isAuthenticated: Boolean(auth.token && auth.user),
  };
}
