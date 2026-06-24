'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// ── Types ──────────────────────────────────────────────────────────────────────

interface Overview {
  total_reports: number;
  total_reports_label: string;
  growth_percent: number;
  active_cases: number;
  active_cases_label: string;
  active_growth_percent: number;
  resolved_cases: number;
  resolved_cases_label: string;
  resolved_growth_percent: number;
}

interface MonthData {
  month: number;
  label: string;
  total_reports: number;
}

interface MonthlyReport {
  year: number;
  total_reports: number;
  reports_per_month: MonthData[];
}

interface ReportItem {
  id: number;
  report_code: string;
  category: string;
  status: string;
  incident_date: string;
  created_at: string;
  is_anonymous: boolean;
  file_path: string | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getToken(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('token') || '';
}

async function adminFetch<T>(endpoint: string): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function adminPatch<T>(endpoint: string, body: unknown): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} mnt lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays === 1) return 'Kemarin';
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

const STATUS_COLOR: Record<string, string> = {
  'Menunggu Verifikasi': 'bg-amber-100 text-amber-700',
  'Perlu Klarifikasi': 'bg-orange-100 text-orange-700',
  'Diproses': 'bg-blue-100 text-blue-700',
  'Diteruskan ke Satgas': 'bg-purple-100 text-purple-700',
  'Selesai': 'bg-green-100 text-green-700',
  'Ditolak': 'bg-red-100 text-red-700',
};

const STATUS_OPTIONS = [
  'Menunggu Verifikasi',
  'Perlu Klarifikasi',
  'Diproses',
  'Diteruskan ke Satgas',
  'Selesai',
  'Ditolak',
];

// ── Subcomponents ─────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  growth,
  alert,
}: {
  icon: string;
  label: string;
  value: string;
  growth: number;
  alert?: boolean;
}) {
  const isPositive = growth >= 0;
  return (
    <div className="glass-card p-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${alert ? 'bg-red-100 text-red-500' : 'bg-primary/10 text-primary'}`}>
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
        {alert && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
            Alert
          </span>
        )}
        {!alert && (
          <span className={`text-xs font-bold flex items-center gap-0.5 ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
            <span className="material-symbols-outlined text-sm">
              {isPositive ? 'trending_up' : 'trending_down'}
            </span>
            {isPositive ? '+' : ''}{growth}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-on-surface">{value}</p>
        <p className="text-xs text-on-surface-variant mt-0.5 uppercase tracking-widest font-semibold">{label}</p>
      </div>
    </div>
  );
}

function BarChart({
  data,
  year,
  onYearChange,
}: {
  data: MonthData[];
  year: number;
  onYearChange: (year: number) => void;
}) {
  const max = Math.max(...data.map((d) => d.total_reports), 1);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 self-end">
        <button
          onClick={() => onYearChange(year - 1)}
          className="w-7 h-7 rounded-full bg-white/40 flex items-center justify-center text-on-surface-variant hover:bg-primary/10 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">chevron_left</span>
        </button>
        <span className="text-sm font-bold text-primary">{year}</span>
        <button
          onClick={() => onYearChange(year + 1)}
          className="w-7 h-7 rounded-full bg-white/40 flex items-center justify-center text-on-surface-variant hover:bg-primary/10 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>
      <div className="flex items-end gap-2 h-36 pt-8">
        {data.map((d) => {
          const height = d.total_reports > 0 ? Math.max((d.total_reports / max) * 100, 18) : 6;
          const isCurrentMonth = d.month === new Date().getMonth() + 1;
          return (
            <div key={d.month} className="flex-1 h-full flex flex-col items-center gap-2 group relative">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {d.total_reports}
              </div>
              <div className="w-full flex-1 flex items-end">
                <div
                  className={`w-full rounded-t-xl transition-all duration-500 cursor-pointer hover:opacity-80 ${
                    d.total_reports > 0
                      ? isCurrentMonth ? 'bg-primary' : 'bg-primary/50'
                      : 'bg-outline-variant/40'
                  }`}
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className="text-[9px] text-on-surface-variant font-medium">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DonutChart({ total, active, resolved }: { total: number; active: number; resolved: number }) {
  const clarification = total - active - resolved;
  const safeTotal = total || 1;
  const resolvedPct = Math.round((resolved / safeTotal) * 100);

  const segments = [
    { value: resolved, color: '#b32053', label: 'Selesai' },
    { value: active, color: '#ff5c8a', label: 'Aktif' },
    { value: Math.max(clarification, 0), color: '#e9d5ff', label: 'Lainnya' },
  ];

  let cumulative = 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const svgSize = 120;
  const center = svgSize / 2;

  return (
    <div className="flex items-center gap-6">
      <div className="relative flex-shrink-0">
        <svg width={svgSize} height={svgSize}>
          {segments.map((seg, i) => {
            const dashLen = (seg.value / safeTotal) * circumference;
            const dashOffset = circumference - cumulative * circumference / safeTotal;
            const el = (
              <circle
                key={i}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="16"
                strokeDasharray={`${dashLen} ${circumference - dashLen}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${center} ${center})`}
                style={{ transition: 'stroke-dasharray 0.7s ease' }}
              />
            );
            cumulative += seg.value;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-primary">{resolvedPct}%</span>
          <span className="text-[9px] text-on-surface-variant font-bold uppercase">Selesai</span>
        </div>
      </div>
      <div className="space-y-2">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: seg.color }} />
            <span className="text-xs text-on-surface-variant">{seg.label}</span>
            <span className="text-xs font-bold text-on-surface ml-auto">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Status Update Modal ────────────────────────────────────────────────────────

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
      <div
        className="relative glass-card p-8 w-full max-w-md z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-on-surface-variant hover:bg-primary/10 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>

        <h3 className="font-bold text-on-surface mb-1">Update Status Laporan</h3>
        <p className="text-xs text-on-surface-variant mb-6">
          <span className="font-bold text-primary">{report.report_code}</span> - {report.category}
        </p>

        <div className="space-y-2 mb-6">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSelected(s)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-left text-sm font-medium
                ${selected === s
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

// ── Main Dashboard ─────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter();

  const [overview, setOverview] = useState<Overview | null>(null);
  const [monthly, setMonthly] = useState<MonthlyReport | null>(null);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [ov, mo, rp] = await Promise.all([
        adminFetch<Overview>('/admin/laporan/overview'),
        adminFetch<MonthlyReport>(`/admin/laporan/monthly?year=${selectedYear}`),
        adminFetch<ReportItem[]>('/admin/laporan/data'),
      ]);
      setOverview(ov);
      setMonthly(mo);
      setReports(rp);
    } catch (e) {
      if ((e as Error).message === 'HTTP 401' || (e as Error).message === 'HTTP 403') {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [router, selectedYear]);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchAll();
    });
  }, [fetchAll]);

  const filteredReports = reports.filter((r) => {
    const matchStatus = statusFilter === 'Semua' || r.status === statusFilter;
    const matchSearch =
      !searchQuery ||
      r.report_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const clarification = reports.filter((r) => r.status === 'Perlu Klarifikasi').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-12 flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-on-surface-variant text-sm font-medium">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24 lg:pb-0">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-in fade-in slide-in-from-left duration-700">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-primary font-bold tracking-widest text-[10px] uppercase">
              Admin Console
            </span>
          </div>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary leading-tight">
            System Overview
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Real-time platform activity and safety monitoring.
          </p>
        </div>
        <div className="flex gap-3 items-center">
          {clarification > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-bold text-red-600">{clarification} perlu klarifikasi</span>
            </div>
          )}
          <button className="p-3 glass-card text-primary active:scale-90">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
            <input
              className="pl-10 pr-4 py-3 glass-card bg-white/30 text-sm outline-none focus:ring-2 focus:ring-primary/20 w-40 md:w-48 rounded-[2rem]"
              placeholder="Cari laporan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Stat Cards */}
      {overview && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon="assignment"
            label="Total Reports"
            value={overview.total_reports_label}
            growth={overview.growth_percent}
          />
          <StatCard
            icon="pending_actions"
            label="Active Cases"
            value={overview.active_cases_label}
            growth={overview.active_growth_percent}
          />
          <StatCard
            icon="task_alt"
            label="Resolved Cases"
            value={overview.resolved_cases_label}
            growth={overview.resolved_growth_percent}
          />
          <StatCard
            icon="warning"
            label="Clarification"
            value={String(clarification)}
            growth={0}
            alert={clarification > 0}
          />
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-on-surface">Reports Per Month</h2>
              <p className="text-xs text-on-surface-variant">Annual trend analysis</p>
            </div>
          </div>
          {monthly ? (
            <BarChart
              data={monthly.reports_per_month}
              year={selectedYear}
              onYearChange={setSelectedYear}
            />
          ) : (
            <div className="h-32 rounded-2xl bg-white/20 border border-dashed border-outline-variant flex items-center justify-center text-center px-4">
              <p className="text-xs font-medium text-on-surface-variant">
                Data laporan bulanan belum tersedia
              </p>
            </div>
          )}
        </div>

        <div className="glass-card p-6">
          <div className="mb-6">
            <h2 className="font-bold text-on-surface">Distribution</h2>
            <p className="text-xs text-on-surface-variant">Proporsi status laporan</p>
          </div>
          {overview && (
            <DonutChart
              total={overview.total_reports}
              active={overview.active_cases}
              resolved={overview.resolved_cases}
            />
          )}
          <div className="mt-6 pt-4 border-t border-white/30 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-lg font-bold text-primary">{overview?.total_reports ?? 0}</p>
              <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Total</p>
            </div>
            <div>
              <p className="text-lg font-bold text-primary">{overview?.active_cases ?? 0}</p>
              <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Aktif</p>
            </div>
            <div>
              <p className="text-lg font-bold text-primary">{overview?.resolved_cases ?? 0}</p>
              <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Selesai</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-bold text-on-surface">Recent Activity</h2>
            <p className="text-xs text-on-surface-variant">
              {filteredReports.length} laporan ditampilkan
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {['Semua', ...STATUS_OPTIONS].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  statusFilter === s
                    ? 'bg-primary text-white'
                    : 'bg-white/30 text-on-surface-variant hover:bg-primary/10'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-on-surface-variant border-b border-white/20">
                <th className="text-left pb-3 pr-4 font-semibold">Case ID</th>
                <th className="text-left pb-3 pr-4 font-semibold">Kategori</th>
                <th className="text-left pb-3 pr-4 font-semibold">Status</th>
                <th className="text-left pb-3 pr-4 font-semibold">Urgensi</th>
                <th className="text-left pb-3 pr-4 font-semibold">Anonim</th>
                <th className="text-left pb-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredReports.slice(0, 10).map((r) => {
                const isUrgent = r.status === 'Perlu Klarifikasi' || r.status === 'Menunggu Verifikasi';
                return (
                  <tr key={r.id} className="hover:bg-white/10 transition-colors group">
                    <td className="py-3 pr-4">
                      <div>
                        <span className="font-bold text-primary">{r.report_code}</span>
                        <p className="text-[11px] text-on-surface-variant">
                          {timeAgo(r.created_at)}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-on-surface font-medium">{r.category}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${STATUS_COLOR[r.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs font-bold flex items-center gap-1 ${isUrgent ? 'text-red-500' : 'text-green-600'}`}>
                        
                        {isUrgent ? 'High' : 'Low'}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs font-bold ${r.is_anonymous ? 'text-tertiary' : 'text-on-surface-variant'}`}>
                        {r.is_anonymous ? 'Ya' : 'Tidak'}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/laporan/${r.id}`}
                          className="p-1.5 rounded-xl bg-white/20 text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors"
                          title="Lihat detail"
                        >
                          <span className="material-symbols-outlined text-sm">open_in_new</span>
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

          {filteredReports.length === 0 && (
            <div className="text-center py-12 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2 block">inbox</span>
              <p className="text-sm">Tidak ada laporan ditemukan</p>
            </div>
          )}
        </div>

        {filteredReports.length > 10 && (
          <div className="mt-4 flex justify-center">
            <Link
              href="/admin/laporan"
              className="px-6 py-2 rounded-full text-primary font-bold text-sm border border-primary/20 hover:bg-primary/5 transition-colors"
            >
              Lihat Semua Laporan -&gt;
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <span className="font-bold text-on-surface block">LINUKS</span>
          <p className="text-xs text-on-surface-variant opacity-70">(c) 2024 LINUKS. Supporting your journey with care.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <a href="#" className="text-xs text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="text-xs text-on-surface-variant hover:text-primary transition-colors">Support Center</a>
          <a href="#" className="text-xs text-on-surface-variant hover:text-primary transition-colors">Terms of Service</a>
        </div>
      </footer>

      {/* Status Modal */}
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
