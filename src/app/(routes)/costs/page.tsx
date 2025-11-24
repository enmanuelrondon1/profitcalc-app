//src/app/(routes)/costs/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReusableCostForm } from "@/components/costs/ReusableCostForm";
import { ReusableCostList } from "@/components/costs/ReusableCostList";

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
    // Consider showing an error message to the user
  }

  return (
    <div className="container p-4 mx-auto md:p-8">
      <h1 className="mb-6 text-3xl font-bold">Costos Reutilizables</h1>
      <p className="mb-8 text-muted-foreground">
        Aquí puedes gestionar una lista de costos comunes para agregarlos rápidamente a tus proyectos.
      </p>

      <div className="grid gap-12 md:grid-cols-3">
        <div className="md:col-span-1">
          <h2 className="mb-4 text-xl font-semibold">Añadir Nuevo Costo </h2>
          <ReusableCostForm />
        </div>
        <div className="md:col-span-2">
           <h2 className="mb-4 text-xl font-semibold">Mis Costos</h2>
          <ReusableCostList costs={costs || []} />
        </div>
      </div>
    </div>
  );
}