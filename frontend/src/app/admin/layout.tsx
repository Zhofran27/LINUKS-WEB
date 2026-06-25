'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const adminMenuItems = [
  { icon: 'dashboard', label: 'Dashboard', href: '/admin/dashboard' },
  { icon: 'description', label: 'Manajemen Laporan', href: '/admin/laporan' },
  { icon: 'auto_stories', label: 'Manajemen Konten', href: '/admin/contentmanagement' },
  { icon: 'manage_accounts', label: 'Manajemen Pengguna', href: '/admin/usermanagement' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex h-screen w-72 fixed left-0 top-0 flex-col bg-white/40 backdrop-blur-2xl border-r border-white/50 z-50 p-6 gap-4">
        <div className="mb-8">
          <Link href="/admin/dashboard" className="font-bold text-primary tracking-tighter text-xl">
            LINUKS
          </Link>
          <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant mt-0.5">
            Admin Console
          </span>
        </div>

        <div className="flex items-center gap-3 p-3 mb-4 bg-primary/5 rounded-[2rem] border border-primary/10">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">admin_panel_settings</span>
          </div>
          <div>
            <span className="text-sm font-bold text-on-surface">Admin BEM</span>
            <span className="block text-[10px] text-on-surface-variant uppercase tracking-widest">
              Console Access
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1 flex-grow">
          {adminMenuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 p-4 rounded-[2rem] transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-container/30 text-on-primary-container font-bold'
                    : 'text-on-surface-variant hover:bg-white/20 hover:translate-x-1'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          className="w-full py-3 px-4 rounded-[2rem] flex items-center gap-3 text-on-surface-variant hover:bg-red-50 hover:text-red-500 transition-colors text-sm font-medium"
        >
          <span className="material-symbols-outlined">logout</span>
          Keluar
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-72 p-6 lg:p-10">
        {children}
      </main>
    </div>
  );
}