'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import { useAuth } from '@/hooks/useAuth';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, token } = useAuth();

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    if (user?.role === 'admin') {
      router.push('/admin/dashboard');
    }
  }, [router, token, user?.role]);

  return (
    <>
      <Sidebar />
      <main className="lg:ml-72 min-h-screen px-grid-margin py-10 relative z-10">
        {children}
      </main>
      <MobileNav />
    </>
  );
}
