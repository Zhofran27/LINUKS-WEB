import { User } from './auth';

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

export type CreateLaporanPayload = {
  title: string;
  category_id: number;
  chronology: string;
  description: string;
  location: string;
  incident_date: string;
  is_anonymous: 0 | 1;
  files?: FileList | null;
};

export type CreateLaporanResponse = {
  message: string;
  reportId: number;
  report_code: string;
};

export type Laporan = {
  id: number;
  report_code: string;
  title: string;
  status_id: number;
  description: string;
  category_id: number;
  location: string;
  incident_date: string;
  is_anonymous: number;
  created_at: string;
  status?: { name: string };
  category?: { name: string };
};

// ============================================================
// HELPERS
// ============================================================

function getToken() {
  return localStorage.getItem('token') || '';
}

async function post<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Terjadi kesalahan');
  }

  return data;
}

async function authGet<T>(endpoint: string): Promise<T> {
  const token = getToken();
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

async function authPost<T>(endpoint: string, body: FormData): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || data.error || 'Terjadi kesalahan');
  }

  return data;
}

// ============================================================
// AUTH
// ============================================================

export const registerUser = (payload: RegisterPayload) =>
  post<AuthResponse>('/Authuser/register', payload);

export const loginUser = (payload: LoginPayload) =>
  post<AuthResponse>('/Authuser/login', payload);

export const getGoogleLoginUrl = () =>
  `${API_URL}/Authuser/google`;


// ============================================================
// USER
// ============================================================

export const fetchUserProfile = () =>
  authGet<User>('/user/profile');

export const fetchUserActivity = () =>
  authGet<unknown[]>('/user/recent-activity');

// ============================================================
// LAPORAN
// ============================================================

export const fetchActiveLaporan = () =>
  authGet<Laporan[]>('/laporan/active');

export const fetchLaporanByUser = () =>
  authGet<Laporan[]>('/laporan/data');

export const createLaporan = (payload: CreateLaporanPayload) => {
  const formData = new FormData();
  formData.append('title', payload.title);
  formData.append('category_id', String(payload.category_id));
  formData.append('chronology', payload.chronology);
  formData.append('description', payload.description);
  formData.append('location', payload.location);
  formData.append('incident_date', payload.incident_date);
  formData.append('is_anonymous', String(payload.is_anonymous));

  if (payload.files) {
    Array.from(payload.files).forEach((file) => {
      formData.append('files', file);
    });
  }

  return authPost<CreateLaporanResponse>('/laporan/create', formData);
};

export async function fetchLibraryBooks() {
  return fetchWithAuth('/library');
}

