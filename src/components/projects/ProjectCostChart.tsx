//src/components/projects/ProjectCostChart.tsx
"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { costCategories } from "@/lib/utils";
import { BarChart3, PieChart as PieChartIcon, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChartData {
  name: string;
  value: number;
}

interface ProjectCostChartProps {
  data: ChartData[];
}

export function ProjectCostChart({ data }: ProjectCostChartProps) {
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");

  if (data.length === 0) {
    return null;
  }

  // Map data with proper colors from costCategories
  const chartData = data.map((item) => {
    const category = costCategories.find((c) => c.label === item.name || c.value === item.name);
    return {
      ...item,
      originalName: item.name,
      name: category ? category.label : item.name,
      fill: category ? category.color : "#8884d8",
      categoryValue: category?.value,
    };
  });

  // Sort by value descending for better visualization
  const sortedData = [...chartData].sort((a, b) => b.value - a.value);

  // Get unique colors from chartData (preserving order)
  const colorMap = new Map<string, string>();
  chartData.forEach((item) => {
    if (!colorMap.has(item.name)) {
      colorMap.set(item.name, item.fill);
    }
  });
  const COLORS = Array.from(colorMap.values());
  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);

  // Custom tooltip for better readability
  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      payload: {
        name: string;
        value: number;
      };
    }>;
  }
  
  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalValue) * 100).toFixed(1);
      return (
        <div className="p-3 border rounded-lg shadow-lg bg-background border-border">
          <p className="text-sm font-semibold text-foreground">{data.name}</p>
          <p className="text-sm font-bold text-primary">${data.value.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">{percentage}% del total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative overflow-hidden border rounded-xl border-border/50 bg-card">
      {/* Gradient background */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary/50" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sm:p-8 border-border/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 border rounded-lg bg-primary/10 border-primary/20">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                Distribución de Costos
              </h3>
              <p className="text-xs text-muted-foreground">
                Total: ${totalValue.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Chart Type Toggle */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={chartType === "pie" ? "default" : "outline"}
              onClick={() => setChartType("pie")}
              className="gap-2"
            >
              <PieChartIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Pie</span>
            </Button>
            <Button
              size="sm"
              variant={chartType === "bar" ? "default" : "outline"}
              onClick={() => setChartType("bar")}
              className="gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Barras</span>
            </Button>
          </div>
        </div>

        {/* Chart Container */}
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-center w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "pie" ? (
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ percent }) => {
                      if (percent === undefined) return null;
                      return percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : null;
                    }}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.fill}
                        className="transition-opacity duration-300 cursor-pointer hover:opacity-80"
                      />
                    ))}
                  </Pie>

                  <Tooltip content={<CustomTooltip />} />

                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => (
                      <span className="text-sm text-foreground">{value}</span>
                    )}
                  />
                </PieChart>
              ) : (
                <BarChart
                  data={sortedData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="var(--muted-foreground)"
                    style={{ fontSize: "12px" }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    style={{ fontSize: "12px" }}
                    label={{ value: "Costo ($)", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="value"
                    fill="#8884d8"
                    radius={[8, 8, 0, 0]}
                    className="transition-opacity duration-300 hover:opacity-80"
                  >
                    {sortedData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Category Stats Grid */}
          <div className="grid gap-3 mt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {chartData.map((item, index) => {
              const percentage = ((item.value / totalValue) * 100).toFixed(1);
              return (
                <div
                  key={index}
                  className="p-3 transition-all duration-300 border rounded-lg bg-muted/50 border-border/50 hover:border-primary/30 hover:bg-muted/70"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    <p className="text-xs font-medium truncate text-muted-foreground">
                      {item.name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">
                      ${item.value.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-primary" />
                      <p className="text-xs font-semibold text-primary">
                        {percentage}%
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Insights */}
          {chartData.length > 0 && (
            <div className="p-4 mt-6 border rounded-lg bg-primary/5 border-primary/20">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    Categoría con mayor costo:
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {chartData[0]?.name} ({((chartData[0]?.value / totalValue) * 100).toFixed(1)}% del total)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}