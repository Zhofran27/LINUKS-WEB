'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// ── Types ──────────────────────────────────────────────────────────────────────

interface ReportItem {
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
}

interface Overview {
  total_reports: number;
  active_cases: number;
  resolved_cases: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('token') || '';
}

async function adminFetch<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function adminPatch<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  'Menunggu Verifikasi',
  'Perlu Klarifikasi',
  'Diproses',
  'Diteruskan ke Satgas',
  'Selesai',
  'Ditolak',
];

const STATUS_STYLE: Record<string, string> = {
  'Menunggu Verifikasi': 'bg-amber-100 text-amber-700 border-amber-200',
  'Perlu Klarifikasi':   'bg-orange-100 text-orange-700 border-orange-200',
  'Diproses':            'bg-blue-100 text-blue-700 border-blue-200',
  'Diteruskan ke Satgas':'bg-purple-100 text-purple-700 border-purple-200',
  'Selesai':             'bg-green-100 text-green-700 border-green-200',
  'Ditolak':             'bg-red-100 text-red-700 border-red-200',
};

const PRIORITY_MAP: Record<string, { label: string; style: string }> = {
  'Menunggu Verifikasi': { label: 'Tinggi', style: 'text-red-500 bg-red-50' },
  'Perlu Klarifikasi':   { label: 'Tinggi', style: 'text-red-500 bg-red-50' },
  'Diproses':            { label: 'Sedang', style: 'text-amber-600 bg-amber-50' },
  'Diteruskan ke Satgas':{ label: 'Sedang', style: 'text-amber-600 bg-amber-50' },
  'Selesai':             { label: 'Rendah', style: 'text-green-600 bg-green-50' },
  'Ditolak':             { label: 'Rendah', style: 'text-green-600 bg-green-50' },
};

// ── Status Modal ───────────────────────────────────────────────────────────────

function StatusModal({
  report,
  onClose,
  onSuccess,
}: {
  report: ReportItem;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [selected, setSelected] = useState(report.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await adminPatch(`/admin/laporan/status/${report.id}`, { status: selected });
      onSuccess();
      onClose();
    } catch (e) {
      setError((e as Error).message || 'Gagal update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="relative glass-card p-8 w-full max-w-md z-10" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-on-surface-variant hover:bg-primary/10 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>

        <h3 className="font-bold text-on-surface mb-1">Update Status Laporan</h3>
        <p className="text-xs text-on-surface-variant mb-6">
          <span className="font-bold text-primary">{report.report_code}</span> — {report.category}
        </p>

        <div className="space-y-2 mb-6">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSelected(s)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-left text-sm font-medium ${
                selected === s
                  ? 'bg-primary/10 text-primary border border-primary/30'
                  : 'bg-white/20 text-on-surface-variant hover:bg-white/40'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${selected === s ? 'border-primary bg-primary' : 'border-outline'}`}>
                {selected === s && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              {s}
            </button>
          ))}
        </div>

        {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || selected === report.status}
          className="w-full py-3 bg-primary text-white font-bold rounded-[2rem] disabled:opacity-50 active:scale-95 transition-all glow-pink"
        >
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function AdminLaporanPage() {
  const router = useRouter();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [rp, ov] = await Promise.all([
        adminFetch<ReportItem[]>('/admin/laporan/data'),
        adminFetch<Overview>('/admin/laporan/overview'),
      ]);
      setReports(rp);
      setOverview(ov);
    } catch (e) {
      if ((e as Error).message.includes('401') || (e as Error).message.includes('403')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { void fetchAll(); }, [fetchAll]);

  const categories = ['Semua', ...Array.from(new Set(reports.map((r) => r.category)))];

  const filtered = reports.filter((r) => {
    const matchStatus = statusFilter === 'Semua' || r.status === statusFilter;
    const matchCategory = categoryFilter === 'Semua' || r.category === categoryFilter;
    const matchSearch =
      !searchQuery ||
      r.report_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase());
      r.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const criticalCount = reports.filter(
    (r) => r.status === 'Menunggu Verifikasi' || r.status === 'Perlu Klarifikasi'
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-12 flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-on-surface-variant text-sm">Memuat data laporan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24 lg:pb-0">

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-in fade-in slide-in-from-left duration-700">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Admin Console
          </span>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary leading-tight">
            Manajemen Laporan
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Tinjau dan kelola laporan yang masuk dari komunitas.
          </p>
        </div>
        <div className="flex gap-3 items-center">
          {criticalCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-bold text-red-600">{criticalCount} butuh tindakan</span>
            </div>
          )}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
            <input
              className="pl-10 pr-4 py-3 glass-card bg-white/30 text-sm outline-none focus:ring-2 focus:ring-primary/20 w-44 rounded-[2rem]"
              placeholder="Cari ID, kategori, nama..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            />
          </div>
        </div>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending', value: reports.filter((r) => r.status === 'Menunggu Verifikasi').length, icon: 'schedule', color: 'text-amber-600 bg-amber-50' },
          { label: 'Dalam Tinjauan', value: reports.filter((r) => r.status === 'Diproses').length, icon: 'manage_search', color: 'text-blue-600 bg-blue-50' },
          { label: 'Selesai', value: overview?.resolved_cases ?? 0, icon: 'task_alt', color: 'text-green-600 bg-green-50' },
          { label: 'Butuh Tindakan', value: criticalCount, icon: 'warning', color: 'text-red-500 bg-red-50', alert: criticalCount > 0 },
        ].map((s) => (
          <div key={s.label} className="glass-card p-5 flex flex-col gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${s.color}`}>
              <span className="material-symbols-outlined text-xl">{s.icon}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-on-surface">{s.value}</p>
              <p className="text-[10px] uppercase tracking-widest font-semibold text-on-surface-variant mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card p-6">
        {/* Filter row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-bold text-on-surface">Kasus Aktif ✦</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Tinjau dan moderasi laporan yang masuk dari komunitas.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <div className="flex items-center gap-1 px-3 py-1.5 glass-card bg-white/30 rounded-[2rem] text-xs font-semibold text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              Status:
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="bg-transparent outline-none text-xs font-bold text-primary cursor-pointer"
              >
                <option value="Semua">Semua Status</option>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 glass-card bg-white/30 rounded-[2rem] text-xs font-semibold text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">category</span>
              Kategori:
              <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                className="bg-transparent outline-none text-xs font-bold text-primary cursor-pointer"
              >
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-on-surface-variant mb-4">
          Menampilkan {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} dari {filtered.length} laporan
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-on-surface-variant border-b border-white/20">
                <th className="text-left pb-3 pr-4 font-semibold">Case ID</th>
                <th className="text-left pb-3 pr-4 font-semibold">Kategori</th>
                <th className="text-left pb-3 pr-4 font-semibold hidden md:table-cell">Pelapor</th>
                <th className="text-left pb-3 pr-4 font-semibold hidden md:table-cell">Tanggal</th>
                <th className="text-left pb-3 pr-4 font-semibold">Status</th>
                <th className="text-left pb-3 pr-4 font-semibold">Prioritas</th>
                <th className="text-left pb-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {paginated.map((r) => {
                const priority = PRIORITY_MAP[r.status] ?? { label: 'Rendah', style: 'text-green-600 bg-green-50' };
                const statusStyle = STATUS_STYLE[r.status] ?? 'bg-gray-100 text-gray-600 border-gray-200';
                return (
                  <tr key={r.id} className="hover:bg-white/10 transition-colors group">
                    <td className="py-4 pr-4">
                      <span className="font-bold text-primary text-xs">{r.report_code}</span>
                    </td>
                    <td className="py-4 pr-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-primary/5 text-primary">
                        {r.category}
                      </span>
                    </td>
                    <td className="py-4 pr-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-outline-variant/30 flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-sm text-on-surface-variant">
                            {r.is_anonymous ? 'visibility_off' : 'person'}
                          </span>
                        </div>
                        <span className="text-xs text-on-surface-variant">
                            {r.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 pr-4 hidden md:table-cell">
                      <span className="text-xs text-on-surface-variant">{formatDate(r.incident_date)}</span>
                    </td>
                    <td className="py-4 pr-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusStyle}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${priority.style}`}>
                        {priority.label}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/laporan/${r.id}`}
                          className="px-3 py-1.5 rounded-full bg-primary/5 text-primary text-[11px] font-bold hover:bg-primary/15 transition-colors"
                        >
                          Tinjau
                        </Link>
                        <button
                          onClick={() => setSelectedReport(r)}
                          className="p-1.5 rounded-xl bg-white/20 text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors"
                          title="Update status"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl mb-3 block">inbox</span>
              <p className="text-sm font-medium">Tidak ada laporan ditemukan</p>
              <p className="text-xs mt-1">Coba ubah filter atau kata kunci pencarian</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs text-on-surface-variant">
              Halaman {page} dari {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-on-surface-variant hover:bg-primary/10 disabled:opacity-30 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page + i - 2;
                if (pageNum > totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                      page === pageNum
                        ? 'bg-primary text-white'
                        : 'bg-white/30 text-on-surface-variant hover:bg-primary/10'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-on-surface-variant hover:bg-primary/10 disabled:opacity-30 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedReport && (
        <StatusModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onSuccess={fetchAll}
        />
      )}
    </div>
  );
}