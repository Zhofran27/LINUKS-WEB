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
      <div className="mb-6">
        <span className="font-display-lg-mobile text-primary font-bold tracking-tighter">
          LINUKS
        </span>
      </div>

      <div className="flex items-center gap-3 p-3 mb-4 bg-white/30 rounded-xl">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
          <img
            alt="User profile"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCy1V93nMMlDF0xM9UWN85aJcu7pgAHfIXNv0Zq-reM6LZnBNgL63mjmBbf7LLeS4VQucpCs1jn43vdQz9XCIokNYe84BSHptPbGjavhmBtc5Eo4ECeMEzvftGdkI6q-BU-5Nj_13VHVNNXqQoHdSfGMtpvhru7Sa_Qwm7MUGppZIDr-1K6AsZul9uXiUQD8P1cMqY14yM9N_0GkDFion1S6kXfnC-uKBh7LnpRh-Sfia2Yb_BA_PV3fNGgyjUo0Z8PjgvyCTt9Jwbu"
          />
        </div>
        <div>
          <p className="font-label-md text-on-surface">Zhofran</p>
          <p className="font-caption text-on-surface-variant uppercase tracking-widest">Safe Member</p>
        </div>
      </div>

      <nav className="flex flex-col gap-2 flex-grow">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 p-4 rounded-lg transition-all duration-200
                ${isActive 
                  ? "bg-primary-container/30 text-on-primary-container font-bold" 
                  : "text-on-surface-variant hover:bg-white/20 hover:translate-x-1"
                }
              `}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className="font-label-md text-label-md">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button className="w-full py-4 px-6 bg-primary text-white font-bold rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg glow-pink">
        <span className="material-symbols-outlined">add_circle</span>
        <span>Create Report</span>
      </button>
    </aside>
  );
}