// src/components/ui/navigation-progress.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function NavigationProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Only show on specific pages
  const showProgress = pathname === "/" || pathname.startsWith("/projects/");

  if (!showProgress) return null;

  return (
    <div className="fixed left-0 right-0 z-40 h-1 top-16 bg-primary/10">
      <div 
        className="h-full transition-all duration-150 ease-out bg-gradient-to-r from-primary to-accent"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}