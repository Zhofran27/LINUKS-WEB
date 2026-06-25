const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

function getToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('token') || '';
}

async function parseJson(res: Response) {
  return res.json().catch(() => ({}));
}

async function adminRequest<T>(endpoint: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });
  const data = await parseJson(res);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return data as T;
}

export type AdminReportItem = {
  id: number;
  report_code: string;
  name: string;
  category: string;
  status: string;
  status_id: number;
  incident_date: string;
  created_at: string;
  is_anonymous: boolean;
  file_path: string | null;
};

export type AdminOverview = {
  total_reports: number;
  active_cases: number;
  resolved_cases: number;
};

export type AdminLaporanDetail = AdminReportItem & {
  title: string;
  description: string;
  chronology: string;
  location: string;
  user_id: number;
};

export const adminFetch = <T>(endpoint: string) =>
  adminRequest<T>(endpoint);

export const adminPatch = <T>(endpoint: string, body: unknown) =>
  adminRequest<T>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });

export const fetchAdminReports = () =>
  adminFetch<AdminReportItem[]>('/admin/laporan/data');

export const fetchAdminOverview = () =>
  adminFetch<AdminOverview>('/admin/laporan/overview');

export const fetchAdminReportById = (id: string) =>
  adminFetch<AdminLaporanDetail[]>(`/admin/laporan/id/${id}`);

export const updateAdminReportStatus = (id: number, status: string) =>
  adminPatch(`/admin/laporan/status/${id}`, { status });
