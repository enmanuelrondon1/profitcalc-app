// src/app/(routes)/projects/components/ProjectsStats.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Target } from 'lucide-react';
import { ProjectStats } from './types';

interface ProjectsStatsProps {
  stats: ProjectStats;
}

export function ProjectsStats({ stats }: ProjectsStatsProps) {
  const { totalProjects, profitableProjects, unprofitableProjects, totalRevenue, avgProfitability } = stats;

  const statCards = [
    {
      title: 'Total Proyectos',
      value: totalProjects.toString(),
      icon: PieChart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Proyectos creados'
    },
    {
      title: 'Rentables',
      value: profitableProjects.toString(),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Proyectos con ganancias'
    },
    {
      title: 'No Rentables',
      value: unprofitableProjects.toString(),
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      description: 'Proyectos con pérdidas'
    },
    {
      title: 'Ganancia Total',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: totalRevenue >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: totalRevenue >= 0 ? 'bg-green-100' : 'bg-red-100',
      description: 'Ingresos netos'
    },
    {
      title: 'Rentabilidad Promedio',
      value: `${avgProfitability.toFixed(1)}%`,
      icon: Target,
      color: avgProfitability >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: avgProfitability >= 0 ? 'bg-green-100' : 'bg-red-100',
      description: 'Margen promedio'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}