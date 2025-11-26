//src/app/(routes)/costs/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReusableCostForm } from "@/components/costs/ReusableCostForm";
import { ReusableCostList } from "@/components/costs/ReusableCostList";
import { BackButton } from "@/components/layout/BackButton";
import { Zap, Library, TrendingUp } from "lucide-react";

export default async function ReusableCostsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: costs, error } = await supabase
    .from("reusable_costs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reusable costs:", error);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky z-40 border-b top-16 border-border/50 bg-background/95 backdrop-blur-xl">
        <div className="px-4 py-6 mx-auto space-y-4 max-w-7xl sm:px-6 lg:px-8">
          <BackButton />
          
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Library className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold sm:text-4xl text-foreground">
                Costos Reutilizables
              </h1>
              <p className="max-w-2xl mt-2 text-sm text-muted-foreground">
                Crea una biblioteca personal de costos comunes. Estos aparecerán en tus proyectos para agregarlos rápidamente.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-8 mx-auto space-y-8 max-w-7xl sm:px-6 lg:px-8 sm:py-12">
        {/* Info Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 border rounded-lg bg-card border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-muted-foreground">Total de Costos</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{costs?.length || 0}</p>
          </div>

          <div className="p-4 border rounded-lg bg-card border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <span className="text-sm font-semibold text-muted-foreground">Costo Promedio</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              ${costs && costs.length > 0 
                ? (costs.reduce((sum, c) => sum + c.unit_price, 0) / costs.length).toFixed(2)
                : "0.00"
              }
            </p>
          </div>

          <div className="p-4 border rounded-lg bg-card border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Library className="w-5 h-5 text-accent" />
              <span className="text-sm font-semibold text-muted-foreground">Costo Total Inventario</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              ${costs?.reduce((sum, c) => sum + c.unit_price, 0).toFixed(2) || "0.00"}
            </p>
          </div>
        </div>

        {/* Grid: Form + List */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Form */}
          <div className="md:col-span-1">
            <div className="sticky overflow-hidden border top-24 rounded-xl border-border/50 bg-card">
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary/50" />
              
              <div className="relative p-6 space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Nuevo Costo</h2>
                  <p className="mt-1 text-xs text-muted-foreground">Agrega a tu biblioteca</p>
                </div>
                <ReusableCostForm />
              </div>
            </div>
          </div>

          {/* List */}
          <div className="md:col-span-2">
            <h2 className="mb-4 text-lg font-bold text-foreground">Mi Biblioteca</h2>
            <ReusableCostList costs={costs || []} />
          </div>
        </div>
      </div>
    </div>
  );
}