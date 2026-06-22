'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';

const authRoutes = ['/login', '/register'];

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = authRoutes.includes(pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

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