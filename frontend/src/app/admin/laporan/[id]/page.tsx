'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// ── Types ──────────────────────────────────────────────────────────────────────

interface LaporanDetail {
  id: number;
  name: string;
  report_code: string;
  title: string;
  description: string;
  chronology: string;
  location: string;
  category: string;
  status: string;
  status_id: number;
  incident_date: string;
  is_anonymous: boolean;
  user_id: number;
  created_at: string;
  file_path: string | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('token') || '';
}

async function adminFetch<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function adminPatch<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
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

const TIMELINE_STEPS = [
  { status: 'Menunggu Verifikasi', label: 'Laporan Diterima',       icon: 'assignment_turned_in' },
  { status: 'Perlu Klarifikasi',   label: 'Perlu Klarifikasi',      icon: 'help_outline' },
  { status: 'Diproses',            label: 'Sedang Ditinjau',        icon: 'manage_search' },
  { status: 'Diteruskan ke Satgas',label: 'Diteruskan ke Satgas',   icon: 'groups' },
  { status: 'Selesai',             label: 'Selesai',                icon: 'verified' },
];

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function AdminLaporanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [laporan, setLaporan] = useState<LaporanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    adminFetch<LaporanDetail[]>(`/admin/laporan/id/${id}`)
      .then((data) => {
        if (data.length === 0) { setError('Laporan tidak ditemukan.'); }
        else { setLaporan(data[0]); setSelectedStatus(data[0].status); }
        setLoading(false);
      })
      .catch((e) => {
        if ((e as Error).message.includes('401') || (e as Error).message.includes('403')) {
          router.push('/login');
        }
        setError((e as Error).message);
        setLoading(false);
      });
  }, [id, router]);

  const handleUpdateStatus = async () => {
    if (!laporan || selectedStatus === laporan.status) return;
    setUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);
    try {
      await adminPatch(`/admin/laporan/status/${laporan.id}`, { status: selectedStatus });
      setLaporan({ ...laporan, status: selectedStatus });
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (e) {
      setUpdateError((e as Error).message || 'Gagal update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-12 flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-on-surface-variant text-sm">Memuat detail laporan...</p>
        </div>
      </div>
    );
  }

  if (error || !laporan) {
    return (
      <div className="max-w-5xl mx-auto glass-card p-12 text-center">
        <span className="material-symbols-outlined text-5xl text-error block mb-3">error</span>
        <p className="font-body-md text-on-surface-variant mb-6">{error || 'Laporan tidak ditemukan.'}</p>
        <button onClick={() => router.back()} className="px-6 py-3 bg-primary text-white rounded-full font-bold text-sm">
          Kembali
        </button>
      </div>
    );
  }

  const statusStyle = STATUS_STYLE[laporan.status] ?? 'bg-gray-100 text-gray-600 border-gray-200';
  const currentStepIndex = TIMELINE_STEPS.findIndex((s) => s.status === laporan.status);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24 lg:pb-0 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 glass-card text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-headline-md text-headline-md text-on-surface">
              Kasus {laporan.report_code}
            </h1>
            <span className={`px-3 py-0.5 rounded-full text-xs font-bold border shrink-0 ${statusStyle}`}>
              {laporan.status}
            </span>
          </div>
          <p className="font-caption text-on-surface-variant text-xs mt-0.5">
            Dilaporkan pada {formatDateTime(laporan.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-on-surface-variant hidden md:block">Status:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border hidden md:block ${statusStyle}`}>
            {laporan.status}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Kiri: Detail laporan */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Informasi Laporan</h2>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-200">
                Prioritas Tinggi
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-1">Subjek</p>
                <p className="font-body-md text-on-surface">{laporan.title}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-1">Pelapor</p>
                <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-on-surface-variant">
                    {laporan.is_anonymous ? 'visibility_off' : 'person'}
                    </span>
                    <p className="font-body-md text-on-surface">
                    {laporan.name}
                    </p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-1">Lokasi</p>
                <p className="font-body-md text-on-surface">{laporan.location}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-1">Tanggal Kejadian</p>
                <p className="font-body-md text-on-surface">{formatDate(laporan.incident_date)}</p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-2">Narasi / Kronologi</p>
              <p className="font-body-md text-on-surface-variant leading-relaxed whitespace-pre-line bg-white/20 rounded-2xl p-4">
                {laporan.chronology || laporan.description}
              </p>
            </div>

            {laporan.chronology && laporan.description && laporan.chronology !== laporan.description && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-2">Deskripsi Tambahan</p>
                <p className="font-body-md text-on-surface-variant leading-relaxed whitespace-pre-line bg-white/20 rounded-2xl p-4">
                  {laporan.description}
                </p>
              </div>
            )}

            {laporan.file_path && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-2">Bukti Terlampir</p>
                <a
                  href={laporan.file_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/30 border border-white/50 hover:bg-white/50 transition-colors group w-fit"
                >
                  <span className="material-symbols-outlined text-primary text-lg">attach_file</span>
                  <span className="text-sm font-medium text-primary group-hover:underline">Lihat Lampiran</span>
                  <span className="material-symbols-outlined text-sm text-on-surface-variant">open_in_new</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Kanan: Timeline + Update Status */}
        <div className="space-y-4">

          {/* Update Status */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Update Status</h2>
              <button
                onClick={handleUpdateStatus}
                disabled={updating || selectedStatus === laporan.status}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded-full disabled:opacity-40 active:scale-95 transition-all glow-pink"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                {updating ? 'Menyimpan...' : 'Update'}
              </button>
            </div>

            {updateSuccess && (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-2xl mb-4 text-xs font-bold text-green-700">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Status berhasil diperbarui
              </div>
            )}
            {updateError && (
              <p className="text-xs text-red-500 mb-4">{updateError}</p>
            )}

            <div className="space-y-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedStatus(s)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-left text-sm font-medium ${
                    selectedStatus === s
                      ? 'bg-primary/10 text-primary border border-primary/30'
                      : 'bg-white/20 text-on-surface-variant hover:bg-white/40'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${selectedStatus === s ? 'border-primary bg-primary' : 'border-outline'}`}>
                    {selectedStatus === s && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="glass-card p-6">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6">Timeline</h2>
            <div className="flex flex-col gap-0">
              {TIMELINE_STEPS.map((step, index) => {
                const isDone = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const isLast = index === TIMELINE_STEPS.length - 1;

                let dotClass = 'bg-white/30 text-on-surface-variant border border-white/40';
                if (laporan.status === 'Ditolak' && isCurrent) {
                  dotClass = 'bg-red-100 text-red-600 border border-red-200';
                } else if (isCurrent) {
                  dotClass = 'bg-primary text-white shadow-lg glow-pink';
                } else if (isDone) {
                  dotClass = 'bg-primary-container text-primary border border-primary/20';
                }

                return (
                  <div key={step.status} className="flex gap-3 relative">
                    {!isLast && (
                      <div className={`absolute left-[15px] top-9 bottom-0 w-0.5 ${isDone ? 'bg-primary/30' : 'bg-white/20'}`} />
                    )}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 ${dotClass}`}>
                      <span className="material-symbols-outlined text-sm">{step.icon}</span>
                    </div>
                    <div className="pb-6">
                      <p className={`font-label-md text-label-md leading-tight ${isCurrent ? 'text-primary font-bold' : isDone ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                        {step.label}
                      </p>
                      {isCurrent && <p className="font-caption text-xs text-on-surface-variant mt-0.5">Sedang berlangsung</p>}
                      {isDone && <p className="font-caption text-xs text-outline mt-0.5">Selesai</p>}
                    </div>
                  </div>
                );
              })}

              {laporan.status === 'Ditolak' && (
                <div className="flex gap-3 mt-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-red-100 text-red-600 border border-red-200">
                    <span className="material-symbols-outlined text-sm">cancel</span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-red-700 font-bold">Laporan Ditolak</p>
                    <p className="font-caption text-xs text-on-surface-variant mt-0.5">Ditandai oleh admin</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}