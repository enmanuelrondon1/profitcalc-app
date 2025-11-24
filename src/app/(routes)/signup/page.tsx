// src/app/(routes)/signup/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignupForm } from "@/components/auth/SignupForm";
import { LogoFull } from "@/components/layout/LogoSystem";
import { Badge } from "@/components/ui/badge";
import { Shield, Star, Zap } from "lucide-react";

export default async function SignupPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/projects");
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-background via-background to-primary/5">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 -translate-x-1/2 -translate-y-1/2 rounded-full w-96 h-96 bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-x-1/2 translate-y-1/2 rounded-full w-96 h-96 bg-accent/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="mb-8 space-y-4 text-center">
          <div className="flex justify-center pointer-events-auto">
            <LogoFull size="lg" href="/" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-center">
              <Badge className="bg-profit-10 text-profit border-profit/30">
                <Zap className="w-3 h-3 mr-1" />
                Únete a 500+ emprendedores
              </Badge>
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Crear Cuenta
            </h1>
            <p className="text-muted-foreground">
              Comienza a calcular tus ganancias reales hoy mismo
            </p>
          </div>
          
          {/* Social proof */}
          <div className="flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-warning text-warning" />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">4.9/5</span>
            </span>
          </div>
        </div>

        {/* Form */}
        <SignupForm />

        {/* Footer Info */}
        <div className="mt-6 space-y-3 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-3 h-3" />
            <span>Datos seguros y encriptados</span>
          </div>
          
          <div className="text-xs text-center text-muted-foreground">
            ✨ Acceso gratuito • Sin tarjeta de crédito • Cancela cuando quieras
          </div>
        </div>
      </div>
    </div>
  );
}