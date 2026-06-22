const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// ============================================================
// TYPES
// ============================================================

export type RegisterPayload = {
  name: string;
  nim: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthResponse = {
  message: string;
  token?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
};

// ============================================================
// HELPERS
// ============================================================

async function post<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    // Backend kirim { message: '...' } kalau error
    throw new Error(data.message || 'Terjadi kesalahan');
  }

  return data;
}

// ============================================================
// AUTH
// ============================================================

// Sesudah
export const registerUser = (payload: RegisterPayload) =>
  post<AuthResponse>('/Authuser/register', payload);

export const loginUser = (payload: LoginPayload) =>
  post<AuthResponse>('/Authuser/login', payload);

export const getGoogleLoginUrl = () =>
  `${API_URL}/Authuser/google`;