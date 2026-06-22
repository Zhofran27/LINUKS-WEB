'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, getGoogleLoginUrl } from '@/lib/api';

export default function LoginForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError('Email dan password wajib diisi');
      return;
    }

    try {
      setIsLoading(true);
      const res = await loginUser(form);

      // Simpan token & data user ke localStorage
      localStorage.setItem('token', res.token!);
      localStorage.setItem('user', JSON.stringify(res.user));

      // Redirect berdasarkan role
      if (res.user?.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
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

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    window.location.href = getGoogleLoginUrl();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">

      {error && (
        <div className="text-red-500 text-xs text-center bg-red-50 border border-red-100 py-2 px-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="nama@univ.ac.id"
          className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none focus:border-pink-400 focus:bg-white transition placeholder:text-gray-300"
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Password
          </label>
          <button
            type="button"
            className="text-xs text-pink-400 hover:underline font-medium"
          >
            Lupa Password?
          </button>
        </div>
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
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500 disabled:opacity-60 text-white font-semibold rounded-xl py-3 text-sm transition shadow-lg shadow-pink-200 cursor-pointer mt-1"
      >
        {isLoading ? 'Masuk...' : 'Login'}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">atau masuk dengan</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Google Login */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isGoogleLoading}
        className="flex items-center justify-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-60 rounded-xl py-3 text-sm font-medium text-gray-600 transition cursor-pointer"
      >
        {/* Google Icon */}
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {isGoogleLoading ? 'Mengarahkan...' : 'Google'}
      </button>

    </form>
  );
}