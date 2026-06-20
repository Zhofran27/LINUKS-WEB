import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

export default function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "",
  onClick 
}: ButtonProps) {
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-container shadow-lg shadow-primary/20",
    secondary: "bg-secondary text-white hover:bg-secondary-container",
    outline: "bg-white/20 border border-white/50 text-on-surface hover:bg-white/40",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      onClick={onClick}
      className={`
        rounded-full font-semibold transition-all duration-200 active:scale-95
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}