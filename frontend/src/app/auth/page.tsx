'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function AuthHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const role = searchParams.get('role');
    const email = searchParams.get('email');

    if (token) {
      // Simpan token ke localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ email, role }));

      // Redirect berdasarkan role
      if (role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } else {
      // Kalau tidak ada token, balik ke login
      router.push('/login');
    }
  }, [router, searchParams]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-purple-300 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Sedang masuk...</p>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthHandler />
    </Suspense>
  );
}