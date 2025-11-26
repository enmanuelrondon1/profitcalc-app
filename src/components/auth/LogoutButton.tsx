//src/components/auth/LogoutButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LoadingOverlay } from "@/components/ui/loading-spinner";

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
  confirmMessage?: string;
  showOverlay?: boolean;
}

export function LogoutButton({ 
  className, 
  children, 
  variant = "ghost",
  size = "sm",
  showIcon = true,
  confirmMessage = "¿Estás seguro de que quieres cerrar sesión?",
  showOverlay = true
}: LogoutButtonProps) {
  const router = useRouter();
  const supabase = createClient();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Error al cerrar sesión. Por favor, intenta de nuevo.");
    } finally {
      setIsLoggingOut(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setShowConfirmDialog(true)}
        className={cn("transition-smooth", className)}
        disabled={isLoggingOut}
      >
        {showIcon && <LogOut className={cn("w-4 h-4", children && "mr-2")} />}
        {children || (showIcon ? "" : "Cerrar Sesión")}
      </Button>

      {/* Diálogo de Confirmación */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <LogOut className="w-5 h-5 text-destructive" />
              ¿Cerrar Sesión?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmMessage}
              <br />
              <span className="text-xs text-muted-foreground">
                Necesitarás volver a iniciar sesión para acceder a tu cuenta.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel disabled={isLoggingOut}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoggingOut ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-current rounded-full animate-spin border-t-transparent" />
                  Cerrando...
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </>
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Overlay de carga */}
      {isLoggingOut && showOverlay && (
        <LoadingOverlay message="Cerrando sesión..." />
      )}
    </>
  );
}