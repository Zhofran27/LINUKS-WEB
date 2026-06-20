"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { icon: "dashboard", label: "Home", href: "/dashboard" },
  { icon: "description", label: "Reports", href: "/reports" },
  { icon: "auto_stories", label: "Library", href: "/library" },
  { icon: "person", label: "Profile", href: "/profile" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-white/20 z-50 flex justify-around p-4">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 ${isActive ? "text-primary" : "text-on-surface-variant opacity-50"}`}
          >
            <span className="material-icons text-2xl">{item.icon}</span>
            <span className="text-[10px] font-bold">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}