// src/components/layout/LogoSystem.tsx
"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "icon" | "full" | "text";
  href?: string;
  className?: string;
}

export function Logo({ 
  size = "md", 
  variant = "full", 
  href = "/",
  className = ""
}: LogoProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  // Tamaños
  const sizes = {
    sm: { icon: 32, text: "text-lg" },
    md: { icon: 40, text: "text-xl" },
    lg: { icon: 48, text: "text-2xl" },
  };

  const currentSize = sizes[size];

  // SVG del logo
  const LogoIcon = () => (
    <svg
      width={currentSize.icon}
      height={currentSize.icon}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-transform duration-300 group-hover:scale-110"
    >
      {/* Fondo gradiente */}
      <defs>
        <linearGradient id="grad-light" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3366FF" stopOpacity="1" />
          <stop offset="100%" stopColor="#0099FF" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="grad-dark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6B9FFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#4DB8FF" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Rectángulo de fondo redondeado */}
      <rect
        width="48"
        height="48"
        rx="10"
        fill={isDark ? "url(#grad-dark)" : "url(#grad-light)"}
        className="transition-colors duration-300"
      />

      {/* Barras del gráfico */}
      <g className="transition-all duration-300">
        {/* Barra 1 - Verde (Ganancias) */}
        <rect x="10" y="28" width="6" height="14" rx="2" fill="#00D084" />
        
        {/* Barra 2 - Azul (Costos) */}
        <rect x="19" y="20" width="6" height="22" rx="2" fill="white" opacity="0.9" />
        
        {/* Barra 3 - Amarillo (Margen) */}
        <rect x="28" y="14" width="6" height="28" rx="2" fill="#FFD700" />

        {/* Línea de tendencia ascendente */}
        <path
          d="M 10 32 Q 19 24 28 16"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
          strokeLinecap="round"
        />
      </g>

      {/* Símbolo de dólar opcional sutil */}
      <text
        x="36"
        y="12"
        fontSize="10"
        fontWeight="bold"
        fill="white"
        opacity="0.8"
      >
        $
      </text>
    </svg>
  );

  const content = (
    <div className="flex items-center gap-3 group">
      {/* Icon */}
      {(variant === "icon" || variant === "full") && (
        <div className={`flex items-center justify-center rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg ${isDark ? "hover:shadow-blue-500/20" : "hover:shadow-blue-400/20"}`}>
          <LogoIcon />
        </div>
      )}

      {/* Text */}
      {(variant === "text" || variant === "full") && (
        <div className="flex flex-col">
          <span className={`${currentSize.text} font-bold bg-gradient-to-r ${isDark ? "from-blue-300 to-cyan-300" : "from-blue-600 to-cyan-600"} bg-clip-text text-transparent transition-all duration-300 group-hover:opacity-80`}>
            ProfitCalc
          </span>
          <span className="text-xs text-muted-foreground">Calcula tus ganancias</span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}

// Logo variants para diferentes usos
type LogoVariantProps = Pick<LogoProps, "size" | "href">;

export function LogoIcon({ size = "md", href = "/" }: LogoVariantProps) {
  return <Logo size={size} variant="icon" href={href} />;
}

export function LogoFull({ size = "md", href = "/" }: LogoVariantProps) {
  return <Logo size={size} variant="full" href={href} />;
}

export function LogoText({ size = "md", href = "/" }: LogoVariantProps) {
  return <Logo size={size} variant="text" href={href} />;
}