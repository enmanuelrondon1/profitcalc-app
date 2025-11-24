
// src/app/(routes)/projects/[projectId]/page.tsx


import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { ProjectWithCosts, ReusableCost } from "@/lib/types";
import { costCategories } from "@/lib/utils";
import { ProjectDetailsView } from "@/components/projects/ProjectDetailsView";

export const dynamic = "force-dynamic";

type ProjectDetailsPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

async function getExchangeRate(): Promise<number | null> {
  const apiKey = process.env.EXCHANGE_RATE_API_KEY;
  if (!apiKey) {
    console.warn(
      "La clave de API de ExchangeRate no fue encontrada. La conversión de moneda estará deshabilitada."
    );
    return null;
  }

  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`,
      { next: { revalidate: 3600 } }
    );
    const data = await response.json();
    return data.conversion_rates.VES;
  } catch (error) {
    console.error("Error al obtener la tasa de cambio:", error);
    return null;
  }
}

export default async function ProjectDetailsPage({
  params,
}: ProjectDetailsPageProps) {
  // ✅ IMPORTANTE: Await params antes de usarlo
  const { projectId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const exchangeRate = await getExchangeRate();

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*, project_costs(*)")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single<ProjectWithCosts>();

  if (projectError || !project) {
    notFound();
  }

  const { data: reusableCostsData } = await supabase
    .from("reusable_costs")
    .select("*")
    .eq("user_id", user.id);

  const costs = project.project_costs || [];
  const reusableCosts: ReusableCost[] = reusableCostsData || [];

  const totalCostUSD = costs.reduce(
    (sum, cost) => sum + cost.quantity * cost.unit_price,
    0
  );

  const costByCategory = costs.reduce(
    (acc: Record<string, number>, cost) => {
      const category = cost.category || "otros";
      const costTotal = cost.quantity * cost.unit_price;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += costTotal;
      return acc;
    },
    {}
  );

  const chartData = Object.entries(costByCategory).map(([name, value]) => {
    const categoryInfo = costCategories.find((c) => c.value === name);
    return {
      name: categoryInfo ? categoryInfo.label : "Otros",
      value,
      fill: categoryInfo ? categoryInfo.color : "#8884d8",
    };
  });

  return (
    <ProjectDetailsView
      project={project}
      costs={costs}
      totalCostUSD={totalCostUSD}
      reusableCosts={reusableCosts}
      exchangeRate={exchangeRate}
      chartData={chartData}
    />
  );
}