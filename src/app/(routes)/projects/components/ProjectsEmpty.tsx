'use client';

import Link from 'next/link';
import { TrendingUp, Plus, Rocket, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@supabase/supabase-js';

interface ProjectsEmptyProps {
  user: User;
}

export function ProjectsEmpty({ user }: ProjectsEmptyProps) {
  const features = [
    {
      icon: Target,
      title: 'Calcula Ganancias',
      description: 'Determina la rentabilidad de tus proyectos con precisión'
    },
    {
      icon: Zap,
      title: 'Análisis Detallado',
      description: 'Obtén insights sobre costos, ingresos y márgenes'
    },
    {
      icon: Rocket,
      title: 'Toma Decisiones',
      description: 'Usa los datos para mejorar tu estrategia de negocio'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] text-center py-12">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5">
          <TrendingUp className="w-10 h-10 text-primary" />
        </div>
        <h2 className="mb-3 text-3xl font-bold text-foreground sm:text-4xl">
          ¡Bienvenido a tus Proyectos!
        </h2>
        <p className="max-w-md mx-auto mb-8 text-lg text-muted-foreground">
          Empieza a calcular la rentabilidad de tus proyectos y toma decisiones basadas en datos reales.
        </p>
        
        <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/30">
          <Link href="/projects/new" className="gap-2">
            <Plus className="w-5 h-5" />
            Crear Tu Primer Proyecto
          </Link>
        </Button>
      </div>

      {/* Features Grid */}
      <div className="grid max-w-4xl grid-cols-1 gap-4 mt-12 sm:grid-cols-3 sm:gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="transition-all duration-300 hover:shadow-md hover:border-primary/30">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 mb-3 rounded-lg bg-primary/10">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tips Section */}
      <div className="max-w-2xl p-6 mt-12 border bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border-primary/10">
        <h3 className="mb-3 text-lg font-semibold text-foreground">
          💡 Consejos para empezar
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Comienza con un proyecto pequeño para familiarizarte con la herramienta</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Incluye todos los costos, incluso los pequeños, para cálculos precisos</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Revisa regularmente tus proyectos para identificar áreas de mejora</span>
          </li>
        </ul>
      </div>
    </div>
  );
}