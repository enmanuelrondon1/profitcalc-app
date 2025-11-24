// src/components/projects/ProjectDetailsView.tsx

"use client";

import { ProjectProfitCalculator } from "./ProjectProfitCalculator";
import { ProjectCostList } from "@/components/projects/ProjectCostList";
import { ProjectCostForm } from "@/components/projects/ProjectCostForm";
import { ProjectCostChart } from "@/components/projects/ProjectCostChart";
import { BackButton } from "@/components/layout/BackButton";
import {
  ProjectWithCosts,
  Cost,
  ProjectCost,
  ReusableCost,
  ChartData,
} from "@/lib/types";
import { Briefcase, Calendar } from "lucide-react";

interface ProjectDetailsViewProps {
  project: ProjectWithCosts;
  costs: Cost[];
  totalCostUSD: number;
  reusableCosts: ReusableCost[];
  exchangeRate: number | null;
  chartData: ChartData[];
}

export function ProjectDetailsView({
  project,
  costs,
  totalCostUSD,
  reusableCosts,
  exchangeRate,
  chartData,
}: ProjectDetailsViewProps) {
  // Filtramos los costos para asegurar que la categoría no sea null
  const validCosts = costs.filter(
    (cost): cost is ProjectCost => cost.category !== null
  );

  // Formato de fecha
  const formatDate = (date: string | null) => {
    if (!date) return "Reciente";
    return new Date(date).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="sticky z-40 border-b top-16 border-primary/10 bg-background/95 backdrop-blur-xl">
        <div className="px-4 py-6 mx-auto space-y-4 max-w-7xl sm:px-6 lg:px-8">
          {/* Back Button */}
          <div>
            <BackButton />
          </div>

          {/* Project Info */}
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Briefcase className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold truncate sm:text-4xl text-foreground">
                {project.name}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {project.description || "Sin descripción"}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(project.created_at)}
                </div>
                <div className="text-xs px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium">
                  ${totalCostUSD.toFixed(2)} en costos
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-8 mx-auto space-y-8 max-w-7xl sm:px-6 lg:px-8 sm:py-12">
        {/* Grid: Profit Calculator + Chart */}
        <div className="grid gap-8 mb-8 md:grid-cols-2">
          <ProjectProfitCalculator
            projectId={project.id}
            totalCost={totalCostUSD}
            sellingPrice={project.selling_price ?? null}
            exchangeRate={exchangeRate}
          />
          <ProjectCostChart data={chartData} />
        </div>

        {/* Costs Section */}
        {validCosts.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                Costos del Proyecto
              </h2>
              <span className="text-xs px-2.5 py-1 rounded-full bg-muted border border-border/50 text-muted-foreground font-medium">
                {validCosts.length} {validCosts.length === 1 ? "costo" : "costos"}
              </span>
            </div>
            <ProjectCostList
              costs={validCosts}
              projectId={project.id}
            />
          </div>
        ) : (
          <div className="p-6 mt-8 text-center border border-dashed rounded-lg border-border/50 bg-muted/30">
            <p className="text-muted-foreground">
              Aún no has añadido costos a este proyecto.
            </p>
          </div>
        )}

        {/* Add Cost Form */}
        <div className="mt-8">
          <ProjectCostForm 
            projectId={project.id} 
            reusableCosts={reusableCosts} 
          />
        </div>
      </div>
    </div>
  );
}