import { getToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export async function fetchActiveLaporan() {
  return fetchWithAuth('/laporan/active');
}

export async function fetchLaporanByUser() {
  return fetchWithAuth('/laporan/data');
}

export async function fetchUserProfile() {
  return fetchWithAuth('/user/profile');
}

export async function fetchUserActivity() {
  return fetchWithAuth('/user/recent-activity');
}