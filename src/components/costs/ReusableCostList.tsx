//src/components/costs/ReusableCostList.tsx
"use client";

import { useState, useTransition } from "react";
import { deleteReusableCost } from "@/app/(routes)/costs/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Copy, DollarSign, Package } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { ReusableCost } from "@/lib/types";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ReusableCostListProps {
  costs: ReusableCost[];
}

export function ReusableCostList({ costs }: ReusableCostListProps) {
  const [isPending, startTransition] = useTransition();
  const [deletingCostId, setDeletingCostId] = useState<string | null>(null);

  const handleDelete = (costId: string) => {
    setDeletingCostId(costId);
  };

  const confirmDelete = async () => {
    if (!deletingCostId) return;

    startTransition(async () => {
      const result = await deleteReusableCost(deletingCostId);
      
      if (result.success) {
        toast.success(result.message || "Costo eliminado");
      } else {
        toast.error(result.message || "Error al eliminar");
      }
      
      setDeletingCostId(null);
    });
  };

  const handleCopy = (cost: ReusableCost) => {
    navigator.clipboard.writeText(`${cost.name} - $${cost.unit_price.toFixed(2)}`);
    toast.success("Copiado al portapapeles", {
      description: cost.name
    });
  };

  if (costs.length === 0) {
    return (
      <div className="p-8 text-center border-2 border-dashed rounded-lg border-border/50 bg-muted/30">
        <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
        <p className="font-medium text-muted-foreground">Aún no hay costos</p>
        <p className="mt-1 text-sm text-muted-foreground/70">
          Crea tu primer costo reutilizable para empezar
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {costs.map((cost) => (
        <div
          key={cost.id}
          className="p-4 transition-colors border rounded-lg border-border/50 bg-card hover:border-primary/30"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold truncate text-foreground">
                  {cost.name}
                </h3>
                {cost.category && (
                  <Badge variant="secondary" className="flex-shrink-0">
                    {cost.category}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold text-foreground">
                    {formatCurrency(cost.unit_price, "USD")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-shrink-0 gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopy(cost)}
                className="transition-colors hover:bg-primary/10 hover:text-primary"
                title="Copiar al portapapeles"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                disabled={isPending}
                onClick={() => handleDelete(cost.id)}
                className="transition-colors hover:bg-destructive/10 hover:text-destructive"
                title="Eliminar costo"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingCostId} onOpenChange={() => setDeletingCostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Costo Reutilizable</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar este costo? Esto no afectará a los costos ya agregados en los proyectos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3 pt-2">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}