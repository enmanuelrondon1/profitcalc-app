// src/components/projects/ProjectDetailsView.tsx

"use client";

import { useState } from "react";
import { ProjectProfitCalculator } from "./ProjectProfitCalculator";
import { ProjectCostList } from "@/components/projects/ProjectCostList";
import { ProjectCostForm } from "@/components/projects/ProjectCostForm";
import { ProjectCostChart } from "@/components/projects/ProjectCostChart";
import { ProjectQuantityEditor } from "./ProjectQuantityEditor";
import { BackButton } from "@/components/layout/BackButton";
import { Button } from "@/components/ui/button";
import {
  ProjectWithCosts,
  Cost,
  ProjectCost,
  ReusableCost,
  ChartData,
} from "@/lib/types";
import {
  Briefcase,
  Calendar,
  DollarSign,
  TrendingUp,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

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
  const [showCostForm, setShowCostForm] = useState(false);
  const [expandedCosts, setExpandedCosts] = useState(true);

  // Filtramos los costos para asegurar que la categoría no sea null
  const validCosts = costs.filter(
    (cost): cost is ProjectCost => cost.category !== null
  );

  // Cálculos financieros
  const profit = (project.selling_price ?? 0) - totalCostUSD;
  const profitMargin =
    (project.selling_price ?? 0) > 0
      ? (profit / (project.selling_price ?? 1)) * 100
      : 0;
  const isProfitable = profit >= 0;

  // Formato de fecha
  const formatDate = (date: string | null) => {
    if (!date) return "Reciente";
    return new Date(date).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Mejorado */}
      <div className="sticky z-40 border-b top-16 border-border/50 bg-background/95 backdrop-blur-xl">
        <div className="px-4 py-6 mx-auto space-y-4 max-w-7xl sm:px-6 lg:px-8">
          {/* Back Button */}
          <div>
            <BackButton />
          </div>

          {/* Project Info Card */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start flex-1 gap-4">
              <div className="flex items-center justify-center flex-shrink-0 shadow-lg w-14 h-14 rounded-xl bg-gradient-to-br from-primary via-accent to-primary/50 shadow-primary/20">
                <Briefcase className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold truncate sm:text-4xl text-foreground">
                  {project.name}
                </h1>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {project.description || "Sin descripción"}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-lg">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(project.created_at)}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-2">
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-medium text-muted-foreground">
                  Costo Total
                </span>
                <span className="text-lg font-bold text-foreground">
                  ${totalCostUSD.toFixed(2)}
                </span>
              </div>
              <div className="w-px bg-border" />
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-medium text-muted-foreground">
                  Ganancia
                </span>
                <span
                  className={`text-lg font-bold ${
                    isProfitable ? "text-success" : "text-destructive"
                  }`}
                >
                  ${profit.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-8 mx-auto space-y-8 max-w-7xl sm:px-6 lg:px-8 sm:py-12">
        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-4 sm:grid-cols-2">
          {/* Total Cost Card */}
          <div className="p-4 border financial-card investment rounded-xl">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Costo Total
                </p>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  ${totalCostUSD.toFixed(2)}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-investment/10">
                <DollarSign className="w-4 h-4 text-investment" />
              </div>
            </div>
          </div>

          {/* Selling Price Card */}
          <div className="p-4 border rounded-xl border-border/50 bg-card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Precio de Venta
                </p>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  ${(project.selling_price ?? 0).toFixed(2)}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
            </div>
          </div>

          {/* Profit Card */}
          <div
            className={`p-4 rounded-xl border ${
              isProfitable ? "financial-card profit" : "financial-card loss"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Ganancia
                </p>
                <p
                  className={`mt-2 text-2xl font-bold ${
                    isProfitable ? "text-success" : "text-destructive"
                  }`}
                >
                  ${profit.toFixed(2)}
                </p>
              </div>
              <div
                className={`p-2 rounded-lg ${
                  isProfitable ? "bg-success/10" : "bg-destructive/10"
                }`}
              >
                <TrendingUp
                  className={`w-4 h-4 ${
                    isProfitable ? "text-success" : "text-destructive"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Margin Card */}
          <div className="p-4 border rounded-xl border-border/50 bg-card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Margen de Ganancia
                </p>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {profitMargin.toFixed(1)}%
                </p>
              </div>
              <div className="p-2 rounded-lg bg-accent/10">
                <TrendingUp className="w-4 h-4 text-accent" />
              </div>
            </div>
          </div>
        </div>

        {/* Grid: Profit Calculator + Chart */}
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-8">
            <ProjectQuantityEditor
              projectId={project.id}
              quantity={project.quantity}
            />
            <ProjectProfitCalculator
              projectId={project.id}
              totalCost={totalCostUSD}
              sellingPrice={project.selling_price ?? null}
              quantity={project.quantity ?? null}
              exchangeRate={exchangeRate}
              projectName={project.name}
            />
          </div>
          {chartData.length > 0 && <ProjectCostChart data={chartData} />}
        </div>

        {/* Costs Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-foreground">
                Costos del Proyecto
              </h2>
              <span className="text-xs px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold">
                {validCosts.length}
              </span>
            </div>
            <Button
              onClick={() => setShowCostForm(!showCostForm)}
              size="sm"
              className="gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Nuevo Costo
            </Button>
          </div>

          {/* Cost Form Toggle */}
          {showCostForm && (
            <div className="p-4 border rounded-xl border-border/50 bg-card">
              <ProjectCostForm
                projectId={project.id}
                reusableCosts={reusableCosts}
              />
            </div>
          )}

          {/* Costs List */}
          {validCosts.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setExpandedCosts(!expandedCosts)}
                  className="flex items-center gap-2 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
                >
                  {expandedCosts ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                  {expandedCosts ? "Ocultar costos" : "Mostrar costos"}
                </button>
              </div>
              {expandedCosts && (
                <ProjectCostList costs={validCosts} projectId={project.id} />
              )}
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed rounded-xl border-border/50 bg-muted/30">
              <Briefcase className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
              <p className="font-medium text-muted-foreground">
                Aún no hay costos registrados
              </p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                Agrega tu primer costo para comenzar a calcular ganancias
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
