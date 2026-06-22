'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/api';

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    nim: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [agree, setAgree] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.nim || !form.email || !form.password) {
      setError('Semua field wajib diisi');
      return;
    }

    if (!/^\d+$/.test(form.nim)) {
      setError('NIM hanya boleh berisi angka');
      return;
    }

    if (!agree) {
      setError('Kamu harus menyetujui syarat dan ketentuan');
      return;
    }

    try {
      setIsLoading(true);
      await registerUser(form);
      router.push('/login');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Terjadi kesalahan, coba lagi');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">

      {error && (
        <div className="text-red-500 text-xs text-center bg-red-50 border border-red-100 py-2 px-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Nama Lengkap */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Nama Lengkap
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="John Doe"
          className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none focus:border-pink-400 focus:bg-white transition placeholder:text-gray-300"
        />
      </div>

      {/* NIM */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          NIM
        </label>
        <input
          type="text"
          name="nim"
          value={form.nim}
          onChange={handleChange}
          placeholder="Nomor Induk Mahasiswa"
          className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none focus:border-pink-400 focus:bg-white transition placeholder:text-gray-300"
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Email Universitas
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="nama@univ.ac.id"
          className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none focus:border-pink-400 focus:bg-white transition placeholder:text-gray-300"
        />
        <p className="text-[10px] font-semibold text-pink-400 uppercase tracking-wide">
          Wajib menggunakan email institusi
        </p>
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none focus:border-pink-400 focus:bg-white transition pr-12 placeholder:text-gray-300"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-400 transition"
          >
            {showPassword ? (
              // Eye-off icon
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
              </svg>
            ) : (
              // Eye icon
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Checkbox */}
      <div className="flex items-start gap-2 bg-pink-50 border border-pink-100 rounded-xl px-3 py-2.5">
        <input
          type="checkbox"
          id="agree"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="mt-0.5 accent-pink-500 shrink-0"
        />
        <label htmlFor="agree" className="text-xs text-gray-500 leading-relaxed">
          Identitasmu dilindungi dengan enkripsi tingkat lanjut. Data pribadimu
          tidak akan pernah dibagikan tanpa persetujuanmu.
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500 disabled:opacity-60 text-white font-semibold rounded-xl py-3 text-sm transition shadow-lg shadow-pink-200 cursor-pointer mt-1"
      >
        {isLoading ? 'Mendaftar...' : 'Daftar'}
      </button>

    </form>
  );
}