import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({ children, className = "", hover = false }: GlassCardProps) {
  return (
    <div
      className={`
        bg-white/40 backdrop-blur-2xl border border-white/50 rounded-2xl
        shadow-[0_8px_32px_0_rgba(53,9,41,0.05)]
        ${hover ? "transition-all duration-300 hover:-translate-y-1 hover:bg-white/50 hover:shadow-[0_20px_40px_rgba(53,9,41,0.08)]" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}