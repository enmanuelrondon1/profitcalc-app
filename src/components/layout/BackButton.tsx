//src/components/layout/BackButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  fallbackUrl?: string;
  className?: string;
}

export function BackButton({ fallbackUrl = "/projects", className = "" }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    // Intenta volver al historial, si no hay historial va a fallbackUrl
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackUrl);
    }
  };

  return (
    <Button
      onClick={handleBack}
      variant="outline"
      size="sm"
      className={`gap-2 border-primary/20 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="hidden sm:inline">Volver</span>
    </Button>
  );
}