'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { fetchLaporanByUser, Laporan } from '@/lib/api';
import { STATUS_MAP } from '@/lib/constants/status';
import LaporanCard from '@/components/laporan/LaporanCard';
import Link from 'next/link';

export default function LaporanPage() {
  const { user, loading: authLoading } = useAuth();
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<number | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;
    fetchLaporanByUser()
      .then((data) => { setLaporan(data); setIsLoading(false); })
      .catch((err) => { setError(err.message); setIsLoading(false); });
  }, [authLoading, user]);

  const filtered = filterStatus ? laporan.filter((l) => l.status_id === filterStatus) : laporan;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24 lg:pb-0">

      <header className="animate-in fade-in slide-in-from-left duration-700">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary leading-tight">
          Laporan Saya
        </h1>
        <p className="font-body-md text-on-surface-variant mt-1">
          Kelola dan pantau perjalanan laporanmu dengan aman.
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus(null)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
              filterStatus === null
                ? 'bg-primary text-white border-primary'
                : 'bg-white/40 text-on-surface-variant border-white/60 hover:bg-white/60'
            }`}
          >
            Semua ({laporan.length})
          </button>
          {[3, 1, 2, 5, 6].map((sid) => {
            const count = laporan.filter((l) => l.status_id === sid).length;
            if (count === 0) return null;
            const s = STATUS_MAP[sid];
            return (
              <button
                key={sid}
                onClick={() => setFilterStatus(filterStatus === sid ? null : sid)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  filterStatus === sid
                    ? 'bg-primary text-white border-primary'
                    : `${s.bg} ${s.color} hover:opacity-80`
                }`}
              >
                {s.label} ({count})
              </button>
            );
          })}
        </div>

        <Link
          href="/user/laporan/buat"
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-bold text-sm shadow-lg glow-pink transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Buat Laporan
        </Link>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6 animate-pulse space-y-3">
              <div className="h-3 bg-white/30 rounded-full w-1/3" />
              <div className="h-5 bg-white/30 rounded-full w-2/3" />
              <div className="h-3 bg-white/20 rounded-full w-full" />
              <div className="h-3 bg-white/20 rounded-full w-3/4" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="glass-card p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-error mb-2 block">error</span>
          <p className="text-on-surface-variant font-body-md">{error}</p>
        </div>
      )}

      {!isLoading && !error && filtered.length === 0 && (
        <div className="glass-card p-12 flex flex-col items-center text-center gap-4">
          <span className="text-6xl">📋</span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">
            {filterStatus ? 'Tidak ada laporan dengan status ini' : 'Belum ada laporan'}
          </h3>
          <p className="font-body-md text-on-surface-variant max-w-sm">
            {filterStatus
              ? 'Coba filter lain atau lihat semua laporan.'
              : 'Ruang ini aman. Ceritakan apa yang kamu alami, kami siap membantu.'}
          </p>
          {!filterStatus && (
            <Link
              href="/user/laporan/buat"
              className="mt-2 px-8 py-3 bg-primary text-white rounded-full font-bold text-sm shadow-lg glow-pink"
            >
              Buat Laporan Pertamamu
            </Link>
          )}
        </div>
      )}

      {!isLoading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => <LaporanCard key={item.id} item={item} />)}
        </div>
      )}
    </div>
  );
}
