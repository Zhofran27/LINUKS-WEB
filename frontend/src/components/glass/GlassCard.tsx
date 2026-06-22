import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  transparent?: boolean;
}

export default function GlassCard({ children, className = "", hover = false, transparent = false }: GlassCardProps) {
  const bgOpacity = transparent ? "20" : "40";
  
  return (
    <div
      className={`
        bg-white/${bgOpacity} backdrop-blur-2xl border border-white/50 rounded-[2.5rem]
        shadow-[0_8px_32px_0_rgba(53,9,41,0.05)]
        ${hover ? "transition-all duration-300 hover:-translate-y-1 hover:bg-white/50 hover:shadow-[0_20px_40px_rgba(53,9,41,0.08)]" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}