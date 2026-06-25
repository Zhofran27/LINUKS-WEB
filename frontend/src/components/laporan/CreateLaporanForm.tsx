'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createLaporan } from '@/lib/api';

// ============================================================
// CONSTANTS
// ============================================================

const CATEGORIES = [
  {
    id: 1,
    name: 'Kekerasan Fisik',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
    ),
  },
  {
    id: 2,
    name: 'Kekerasan Digital',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    id: 3,
    name: 'Pelecehan',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 4,
    name: 'Lainnya',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
      </svg>
    ),
  },
];

const STEPS = [
  'KATEGORI & JUDUL',
  'DESKRIPSI & DETAIL',
  'BUKTI & PRIVASI',
  'TINJAUAN AKHIR',
];

// ============================================================
// TYPES
// ============================================================

type FormData = {
  title: string;
  category_id: number;
  chronology: string;
  description: string;
  location: string;
  incident_date: string;
  is_anonymous: 0 | 1;
};

// ============================================================
// PROGRESS BAR
// ============================================================

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
          Langkah {step}: {STEPS[step - 1]}
        </span>
        <span className="text-[10px] font-bold text-on-surface-variant">
          {step}/4
        </span>
      </div>
      <div className="w-full h-1.5 bg-surface-container-low rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>
    </div>
  );
}

// ============================================================
// STEP 1 — KATEGORI & JUDUL
// ============================================================

function Step1({
  form,
  setForm,
  onNext,
  onBack,
}: {
  form: FormData;
  setForm: (f: FormData) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!form.category_id || !form.title) {
      setError('Pilih kategori dan isi judul laporan');
      return;
    }
    onNext();
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-on-surface mb-1">Apa yang terjadi?</h2>
        <p className="text-sm text-on-surface-variant">
          Mulai laporanmu dengan memilih kategori dan judul kejadian.
        </p>
      </div>

      {error && (
        <p className="text-xs text-red-500 bg-red-50 px-4 py-2 rounded-2xl text-center">
          {error}
        </p>
      )}

      {/* Kategori Grid */}
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              setForm({ ...form, category_id: cat.id });
              setError('');
            }}
            className={`
              flex flex-col items-center gap-2 p-5 rounded-3xl border-2 transition-all duration-200
              ${form.category_id === cat.id
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-white/50 bg-white/30 text-on-surface-variant hover:border-primary/30 hover:bg-white/50'
              }
            `}
          >
            {cat.icon}
            <span className="text-sm font-medium text-center">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Judul */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
          Judul Laporan
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => {
            setForm({ ...form, title: e.target.value });
            setError('');
          }}
          placeholder="contoh: Kejadian di Gedung A lt. 2"
          className="w-full px-5 py-4 rounded-2xl bg-white/40 border border-white/50 text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary/50 focus:bg-white/60 transition text-sm"
        />
      </div>

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition font-medium text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Kembali
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-8 py-3 bg-primary text-white font-bold rounded-full flex items-center gap-2 shadow-lg glow-pink active:scale-95 transition-all"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
}

// ============================================================
// STEP 2 — DESKRIPSI & DETAIL
// ============================================================

function Step2({
  form,
  setForm,
  onNext,
  onBack,
}: {
  form: FormData;
  setForm: (f: FormData) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!form.description || !form.incident_date || !form.location) {
      setError('Semua field wajib diisi');
      return;
    }
    onNext();
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-on-surface mb-1">Ceritakan lebih lanjut</h2>
        <p className="text-sm text-on-surface-variant">
          Detail membantu kami memahami situasimu. Tidak perlu terburu-buru.
        </p>
      </div>

      {error && (
        <p className="text-xs text-red-500 bg-red-50 px-4 py-2 rounded-2xl text-center">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
          Deskripsi Kejadian
        </label>
        <textarea
          value={form.description}
          onChange={(e) => {
            setForm({ ...form, description: e.target.value });
            setError('');
          }}
          placeholder="Ceritakan apa yang terjadi dengan detail yang kamu rasa nyaman untuk dibagikan..."
          rows={5}
          className="w-full px-5 py-4 rounded-2xl bg-white/40 border border-white/50 text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary/50 focus:bg-white/60 transition text-sm resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            Kapan kejadiannya?
          </label>
          <input
            type="date"
            value={form.incident_date}
            onChange={(e) => {
              setForm({ ...form, incident_date: e.target.value });
              setError('');
            }}
            className="w-full px-4 py-4 rounded-2xl bg-white/40 border border-white/50 text-on-surface outline-none focus:border-primary/50 focus:bg-white/60 transition text-sm"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            Di mana?
          </label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => {
              setForm({ ...form, location: e.target.value });
              setError('');
            }}
            placeholder="Lokasi atau area kejadian"
            className="w-full px-4 py-4 rounded-2xl bg-white/40 border border-white/50 text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary/50 focus:bg-white/60 transition text-sm"
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition font-medium text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Kembali
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-8 py-3 bg-primary text-white font-bold rounded-full flex items-center gap-2 shadow-lg glow-pink active:scale-95 transition-all"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
}

// ============================================================
// STEP 3 — BUKTI & PRIVASI
// ============================================================

function Step3({
  form,
  setForm,
  files,
  setFiles,
  onNext,
  onBack,
}: {
  form: FormData;
  setForm: (f: FormData) => void;
  files: FileList | null;
  setFiles: (f: FileList | null) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-on-surface mb-1">Bukti & Privasi</h2>
        <p className="text-sm text-on-surface-variant">
          Kamu bisa upload file atau screenshot. Kamu juga yang menentukan identitasmu.
        </p>
      </div>

      {/* Upload */}
      <label
        htmlFor="files"
        className="w-full py-10 rounded-2xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/40 hover:bg-white/30 transition bg-white/20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <div className="text-center">
          <p className="text-sm font-medium text-on-surface">
            {files && files.length > 0
              ? `${files.length} file dipilih`
              : 'Klik untuk upload atau seret file ke sini'}
          </p>
          <p className="text-xs text-on-surface-variant mt-1">PNG, JPG, PDF maksimal 10MB</p>
        </div>
        <input
          type="file"
          id="files"
          multiple
          accept="image/*,.pdf,.doc,.docx"
          onChange={(e) => setFiles(e.target.files)}
          className="hidden"
        />
      </label>

      {/* Toggle Anonim */}
      <div className="flex items-start gap-4 bg-primary/5 border border-primary/10 rounded-2xl px-5 py-4">
        <div className="shrink-0 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
          </svg>
        </div>
        <div className="grow">
          <p className="text-sm font-bold text-on-surface">Laporkan Secara Anonim</p>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Identitasmu akan disembunyikan dari publik, namun admin mungkin tetap menghubungimu untuk informasi lebih lanjut.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setForm({ ...form, is_anonymous: form.is_anonymous === 1 ? 0 : 1 })}
          className={`
            relative w-11 h-6 rounded-full transition-all duration-300 shrink-0 mt-0.5
            ${form.is_anonymous === 1 ? 'bg-primary' : 'bg-outline-variant'}
          `}
        >
          <span
            className={`
              absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300
              ${form.is_anonymous === 1 ? 'left-5' : 'left-0.5'}
            `}
          />
        </button>
      </div>

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition font-medium text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Kembali
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-8 py-3 bg-primary text-white font-bold rounded-full flex items-center gap-2 shadow-lg glow-pink active:scale-95 transition-all"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
}

// ============================================================
// STEP 4 — TINJAUAN AKHIR
// ============================================================

function Step4({
  form,
  isLoading,
  onSubmit,
  onBack,
}: {
  form: FormData;
  isLoading: boolean;
  onSubmit: () => void;
  onBack: () => void;
}) {
  const categoryName = CATEGORIES.find((c) => c.id === form.category_id)?.name || '-';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-xl font-bold text-on-surface">Siap untuk dikirim?</h2>
      </div>

      {/* Review Card */}
      <div className="bg-white/50 border border-white/60 rounded-2xl p-5">
        <div className="flex justify-between items-start mb-3">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            Ringkasan Laporan
          </span>
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
            Draf
          </span>
        </div>

        <h3 className="font-bold text-on-surface text-base mb-2">{form.title}</h3>

        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1 text-xs text-on-surface-variant">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {form.incident_date}
          </div>
          <div className="flex items-center gap-1 text-xs text-on-surface-variant">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {form.location}
          </div>
        </div>

        <div className="text-xs text-on-surface-variant bg-surface-container-low rounded-xl px-3 py-2 mb-3 italic">
          &ldquo;{form.description.length > 120
            ? form.description.slice(0, 120) + '...'
            : form.description}&rdquo;
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Kategori:</span>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{categoryName}</span>
          {form.is_anonymous === 1 && (
            <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">Anonim</span>
          )}
        </div>
      </div>

      {/* Motivasi */}
      <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <p className="text-sm text-primary font-medium italic">
          Kamu membantu LINUKS menjadi tempat yang lebih aman untuk semua.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition font-medium text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Kembali
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="px-8 py-3 bg-primary text-white font-bold rounded-full flex items-center gap-2 shadow-lg glow-pink active:scale-95 transition-all disabled:opacity-60"
        >
          {isLoading ? 'Mengirim...' : 'Kirim Laporan'}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// HALAMAN SUKSES
// ============================================================

function HalamanSukses({ reportCode }: { reportCode: string }) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center text-center gap-6 py-4">
      <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-primary leading-tight mb-2">
          Terima kasih telah<br />mempercayai LINUKS.
        </h2>
        <p className="text-sm text-on-surface-variant max-w-xs mx-auto">
          Laporan kamu telah kami terima dengan aman. Kami di sini untuk mendukung langkah kamu selanjutnya.
        </p>
      </div>

      {/* Nomor Laporan */}
      <div className="flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-5 py-2.5">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span className="text-sm text-on-surface-variant">Nomor Laporan:</span>
        <span className="text-sm font-bold text-primary">{reportCode}</span>
      </div>

      {/* Tombol Aksi */}
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <button
          onClick={() => router.push('/user/laporan')}
          className="px-6 py-3 bg-primary text-white font-bold rounded-full flex items-center gap-2 shadow-lg glow-pink active:scale-95 transition-all text-sm"
        >
          Lacak Laporanku
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
        <button
          onClick={() => router.push('/user/dashboard')}
          className="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Kembali ke Dashboard
        </button>
      </div>

      <p className="text-xs text-on-surface-variant italic mt-2">
        &ldquo;Setiap suara berharga. Kamu tidak sendirian dalam perjalanan ini.&rdquo;
      </p>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function CreateLaporanForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
    title: '',
    category_id: 0,
    chronology: '',
    description: '',
    location: '',
    incident_date: '',
    is_anonymous: 0,
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reportCode, setReportCode] = useState('');

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const res = await createLaporan({
        ...form,
        chronology: form.description,
        files,
      });
      setReportCode(res.report_code);
      setStep(5);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 5) {
    return <HalamanSukses reportCode={reportCode} />;
  }

  return (
    <div>
      <ProgressBar step={step} />
      {step === 1 && (
        <Step1
          form={form}
          setForm={setForm}
          onNext={() => setStep(2)}
          onBack={() => router.push('/user/laporan')}
        />
      )}
      {step === 2 && (
        <Step2
          form={form}
          setForm={setForm}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <Step3
          form={form}
          setForm={setForm}
          files={files}
          setFiles={setFiles}
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      )}
      {step === 4 && (
        <Step4
          form={form}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onBack={() => setStep(3)}
        />
      )}
    </div>
  );
}
