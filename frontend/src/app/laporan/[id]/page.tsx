'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useParams, useRouter } from 'next/navigation';
import { fetchLaporanById, Laporan } from '@/lib/api';
import Link from 'next/link';

const STATUS_MAP: Record<number, {
  label: string; color: string; bg: string; icon: string; progress: number; keterangan: string;
}> = {
  1: { label: 'Menunggu Verifikasi', color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200',  icon: 'schedule',     progress: 15,  keterangan: 'Laporanmu sudah diterima dan sedang dalam antrian verifikasi.' },
  2: { label: 'Perlu Klarifikasi',   color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', icon: 'help',         progress: 30,  keterangan: 'Tim kami memerlukan informasi atau dokumen tambahan darimu.' },
  3: { label: 'Dalam Proses',        color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',     icon: 'sync',         progress: 60,  keterangan: 'Laporanmu sedang aktif ditinjau oleh tim profesional kami.' },
  4: { label: 'Diteruskan Satgas',   color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', icon: 'groups',       progress: 85,  keterangan: 'Laporan telah diteruskan ke Satgas untuk penanganan lebih lanjut.' },
  5: { label: 'Selesai',             color: 'text-green-700',  bg: 'bg-green-50 border-green-200',   icon: 'check_circle', progress: 100, keterangan: 'Laporan telah selesai ditangani. Terima kasih atas kepercayaanmu.' },
  6: { label: 'Ditolak',             color: 'text-red-700',    bg: 'bg-red-50 border-red-200',       icon: 'cancel',       progress: 0,   keterangan: 'Laporan tidak dapat diproses. Hubungi kami jika ada pertanyaan.' },
};

const CATEGORY_MAP: Record<number, string> = {
  1: 'Kekerasan Fisik',
  2: 'Kekerasan Digital',
  3: 'Pelecehan',
  4: 'Lainnya',
};

const TIMELINE_STEPS = [
  { status_id: 1, label: 'Laporan Diterima',       icon: 'assignment_turned_in' },
  { status_id: 2, label: 'Perlu Klarifikasi',      icon: 'help_outline' },
  { status_id: 3, label: 'Sedang Ditinjau',        icon: 'manage_search' },
  { status_id: 4, label: 'Diteruskan ke Satgas',   icon: 'groups' },
  { status_id: 5, label: 'Selesai',                icon: 'verified' },
];

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

export default function LaporanDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [laporan, setLaporan] = useState<Laporan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user || !id) return;
    fetchLaporanById(id)
      .then((data) => {
        if (data.length === 0) { setError('Laporan tidak ditemukan.'); }
        else { setLaporan(data[0]); }
        setIsLoading(false);
      })
      .catch((err) => { setError(err.message); setIsLoading(false); });
  }, [authLoading, user, id]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 pb-24 lg:pb-0">
        <div className="h-8 bg-white/30 rounded-full w-1/4 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-8 animate-pulse space-y-4">
            <div className="h-5 bg-white/30 rounded-full w-1/2" />
            <div className="h-3 bg-white/20 rounded-full w-full" />
            <div className="h-3 bg-white/20 rounded-full w-3/4" />
          </div>
          <div className="glass-card p-6 animate-pulse space-y-4">
            {[1,2,3,4].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20" />
                <div className="flex-1 space-y-1 pt-1">
                  <div className="h-3 bg-white/20 rounded-full w-1/2" />
                  <div className="h-2 bg-white/10 rounded-full w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !laporan) {
    return (
      <div className="max-w-5xl mx-auto glass-card p-12 text-center">
        <span className="material-symbols-outlined text-5xl text-error block mb-3">error</span>
        <p className="font-body-md text-on-surface-variant mb-6">{error || 'Laporan tidak ditemukan.'}</p>
        <Link href="/laporan" className="px-6 py-3 bg-primary text-white rounded-full font-bold text-sm">
          Kembali ke Daftar Laporan
        </Link>
      </div>
    );
  }

  const status = STATUS_MAP[laporan.status_id] || STATUS_MAP[1];
  const category = CATEGORY_MAP[laporan.category_id] || 'Lainnya';
  const currentStepIndex = TIMELINE_STEPS.findIndex((s) => s.status_id === laporan.status_id);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24 lg:pb-0 animate-in fade-in duration-500">

      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 glass-card text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-headline-md text-headline-md text-on-surface truncate">
              Kasus {laporan.report_code}
            </h1>
            <span className={`px-3 py-0.5 rounded-full text-xs font-bold border shrink-0 ${status.bg} ${status.color}`}>
              {status.label}
            </span>
          </div>
          <p className="font-caption text-on-surface-variant text-xs mt-0.5">
            Dilaporkan pada {formatDateTime(laporan.created_at)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Informasi Laporan</h2>
              {laporan.is_anonymous === 1 && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-container text-secondary text-xs font-bold">
                  <span className="material-symbols-outlined text-sm">visibility_off</span>
                  Anonim
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-1">Kategori</p>
                <p className="font-body-md text-on-surface">{category}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-1">Tanggal Kejadian</p>
                <p className="font-body-md text-on-surface">{formatDate(laporan.incident_date)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-1">Lokasi</p>
                <p className="font-body-md text-on-surface">{laporan.location}</p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-2">Deskripsi</p>
              <p className="font-body-md text-on-surface-variant leading-relaxed whitespace-pre-line">
                {laporan.description}
              </p>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Status Penanganan</h3>
              <span className={`text-xs font-bold ${status.color}`}>{status.progress}%</span>
            </div>
            <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-700"
                style={{ width: `${status.progress}%` }}
              />
            </div>
            <p className="font-caption text-on-surface-variant text-xs">{status.keterangan}</p>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6">Riwayat Proses</h2>

          <div className="flex flex-col gap-0">
            {TIMELINE_STEPS.map((step, index) => {
              const isDone = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const isLast = index === TIMELINE_STEPS.length - 1;

              let dotClass = 'bg-white/30 text-on-surface-variant border border-white/40';
              if (laporan.status_id === 6 && isCurrent) {
                dotClass = 'bg-red-100 text-red-600 border border-red-200';
              } else if (isCurrent) {
                dotClass = 'bg-primary text-white shadow-lg glow-pink';
              } else if (isDone) {
                dotClass = 'bg-primary-container text-primary border border-primary/20';
              }

              return (
                <div key={step.status_id} className="flex gap-3 relative">
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

            {laporan.status_id === 6 && (
              <div className="flex gap-3 mt-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-red-100 text-red-600 border border-red-200">
                  <span className="material-symbols-outlined text-sm">cancel</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-red-700 font-bold">Laporan Ditolak</p>
                  <p className="font-caption text-xs text-on-surface-variant mt-0.5">Hubungi kami untuk informasi lebih lanjut.</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-white/20">
            <p className="font-caption text-xs text-on-surface-variant mb-3">Ada pertanyaan tentang laporanmu?</p>
            <button className="w-full py-3 border border-primary/20 rounded-full text-primary font-bold text-sm hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-base">support_agent</span>
              Hubungi Tim Kami
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}