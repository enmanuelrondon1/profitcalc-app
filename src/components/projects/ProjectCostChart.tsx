//src/components/projects/ProjectCostChart
"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { costCategories } from "@/lib/utils";
import { BarChart3 } from "lucide-react";

interface ChartData {
  name: string;
  value: number;
}

interface ProjectCostChartProps {
  data: ChartData[];
}

export function ProjectCostChart({ data }: ProjectCostChartProps) {
  if (data.length === 0) {
    return null;
  }

  // Map data with proper colors from costCategories
  const chartData = data.map((item) => {
    const category = costCategories.find((c) => c.value === item.name);
    return {
      ...item,
      name: category ? category.label : item.name,
      fill: category ? category.color : "#8884d8",
    };
  });

  const COLORS = chartData.map((item) => item.fill);

  return (
    <div className="relative overflow-hidden border rounded-xl border-border/50 bg-card">
      {/* Gradient background */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary/50" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b sm:p-8 border-border/50">
          <div className="flex items-center justify-center w-10 h-10 border rounded-lg bg-primary/10 border-primary/20">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              Distribución de Costos
            </h3>
            <p className="text-xs text-muted-foreground">
              Análisis por categoría
            </p>
          </div>
        </div>

        {/* Chart Container */}
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-center w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percent, midAngle, cx, cy, innerRadius, outerRadius }) => {
                    if (percent === undefined || midAngle === undefined) return null;

                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

                    return (
                      <text
                        x={x}
                        y={y}
                        fill="white"
                        textAnchor={x > cx ? "start" : "end"}
                        dominantBaseline="central"
                        className="text-sm font-bold drop-shadow-lg"
                      >
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={color}
                      className="transition-opacity duration-300 cursor-pointer hover:opacity-80"
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => `$${(value as number).toFixed(2)}`}
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                  labelStyle={{ color: "var(--foreground)" }}
                  cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                />

                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-sm text-foreground">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Stats */}
          <div className="grid grid-cols-2 gap-3 mt-8 sm:grid-cols-3 md:grid-cols-4">
            {chartData.map((item, index) => {
              const percentage = ((item.value / chartData.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1);
              return (
                <div
                  key={index}
                  className="p-3 transition-colors duration-300 border rounded-lg bg-muted/50 border-border/50 hover:border-primary/30"
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
                  <p className="text-sm font-bold text-foreground">
                    ${item.value.toFixed(2)}
                  </p>
                  <p className="text-xs text-primary">{percentage}%</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}