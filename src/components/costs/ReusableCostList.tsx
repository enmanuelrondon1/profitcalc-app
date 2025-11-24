//src/components/costs/ReusableCostList.tsx
"use client";

import { deleteReusableCost } from "@/app/(routes)/costs/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { ReusableCost } from "@/lib/types";

interface ReusableCostListProps {
  costs: ReusableCost[];
}

export function ReusableCostList({ costs }: ReusableCostListProps) {
  if (costs.length === 0) {
    return (
      <div className="p-8 text-center border-2 border-gray-300 border-dashed rounded-lg text-muted-foreground">
        <p>Aún no has añadido ningún costo reutilizable.</p>
        <p className="mt-2 text-sm">
          Crea uno usando el formulario para empezar.
        </p>
      </div>
    );
  }

  const handleDelete = async (costId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este costo?")) {
      await deleteReusableCost(costId);
    }
  };

  return (
    <div className="space-y-4">
      {costs.map((cost) => (
        <Card key={cost.id}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">{cost.name}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(cost.id)}
            >
              <Trash2 className="w-4 h-4 text-muted-foreground" />
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {cost.category || "Sin categoría"}
            </p>
            <p className="text-2xl font-bold">
              {formatCurrency(cost.unit_price, "USD")}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
