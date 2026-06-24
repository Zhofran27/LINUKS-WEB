'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import AuroraBackground from '@/components/aurora/AuroraBackground';

const authRoutes = ['/login', '/register'];
const landingRoutes = ['/', '/library'];

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = authRoutes.includes(pathname);
  const isLandingPage = landingRoutes.includes(pathname);
  const isAdminPage = pathname.startsWith('/admin');

  if (isAuthPage || isLandingPage) {
    return <>{children}</>;
  }

  if (isAdminPage) {
    return (
      <>
        <AuroraBackground />
        <div className="relative z-0 min-h-screen">
          {children}
        </div>
      </>
    );
  }

  return (
    <>
      <AuroraBackground />
      <div className="relative z-0 min-h-screen">
        <Sidebar />
        <main className="lg:ml-72 min-h-screen px-grid-margin py-10 relative z-10">
          {children}
        </main>
        <MobileNav />
      </div>
    </>
  );
}
