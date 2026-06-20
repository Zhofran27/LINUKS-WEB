"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { icon: "dashboard", label: "Dashboard", href: "/dashboard" },
  { icon: "description", label: "Reports", href: "/reports" },
  { icon: "auto_stories", label: "Library", href: "/library" },
  { icon: "person", label: "Profile", href: "/profile" },
  { icon: "settings", label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex h-screen w-72 fixed left-0 top-0 flex-col bg-white/40 backdrop-blur-2xl border-r border-white/50 p-6 gap-4 z-50">
      {/* Logo */}
      <div className="mb-6">
        <span className="text-2xl font-[family-name:var(--font-sora)] font-bold text-primary">
          LINUKS
        </span>
      </div>

      {/* User Profile */}
      <div className="flex items-center gap-3 p-3 mb-4 bg-white/30 rounded-xl">
        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white font-bold">
          Z
        </div>
        <div>
          <p className="text-sm font-semibold text-on-surface">Zhofran</p>
          <p className="text-xs text-on-surface-variant">Safe Member</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-2 flex-grow">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                ${isActive 
                  ? "bg-primary-container/30 text-primary font-bold" 
                  : "text-on-surface-variant hover:bg-white/20 hover:translate-x-1"
                }
              `}
            >
              <span className="material-icons text-xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Create Report Button */}
      <button className="w-full py-4 bg-primary text-white font-bold rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg">
        <span className="material-icons">add_circle</span>
        <span>Create Report</span>
      </button>
    </aside>
  );
}