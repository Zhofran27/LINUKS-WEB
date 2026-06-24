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
  user?: User;
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
  user_id?: number;
  category_id: number;
  status_id: number;
  title: string;
  description: string;
  chronology?: string;
  location: string;
  incident_date: string;
  is_anonymous: 0 | 1 | number;
  created_at: string;
  report_code: string;
  status?: { name: string };
  category?: { name: string };
};

export type LibraryBook = {
  id: number;
  title: string;
  description?: string;
  category?: string;
  image?: string;
  [key: string]: unknown;
};

// ============================================================
// HELPERS
// ============================================================

function getToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('token') || '';
}

async function parseJson(res: Response) {
  return res.json().catch(() => ({}));
}

function getErrorMessage(data: unknown, fallback: string) {
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    if (typeof record.message === 'string') return record.message;
    if (typeof record.error === 'string') return record.error;
  }

  return fallback;
}

async function request<T>(endpoint: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, init);
  const data = await parseJson(res);

  if (!res.ok) {
    throw new Error(getErrorMessage(data, `HTTP ${res.status}`));
  }

  return data as T;
}

function authHeaders(contentType?: string): HeadersInit {
  const token = getToken();
  if (!token) throw new Error('Unauthorized');

  return {
    Authorization: `Bearer ${token}`,
    ...(contentType ? { 'Content-Type': contentType } : {}),
  };
}

async function post<T>(endpoint: string, body: unknown): Promise<T> {
  return request<T>(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function authGet<T>(endpoint: string): Promise<T> {
  return request<T>(endpoint, {
    headers: authHeaders('application/json'),
  });
}

async function authPostForm<T>(endpoint: string, body: FormData): Promise<T> {
  return request<T>(endpoint, {
    method: 'POST',
    headers: authHeaders(),
    body,
  });
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

export const fetchLaporanById = (id: string) =>
  authGet<Laporan[]>(`/laporan/id/${id}`);

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

  return authPostForm<CreateLaporanResponse>('/laporan/create', formData);
};

// ============================================================
// LIBRARY
// ============================================================

export const fetchLibraryBooks = () =>
  authGet<LibraryBook[]>('/library');
