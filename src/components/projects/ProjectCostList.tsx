// src/components/projects/ProjectCostList.tsx

"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, DollarSign, Package } from "lucide-react";
import { deleteProjectCost } from "@/app/(routes)/projects/[projectId]/actions";
import { useProjectsStore } from "@/lib/stores/projectsStore";
import { EditCostDialog } from "./EditCostDialog";
import { Cost, ProjectCost } from "@/lib/types";
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

interface ProjectCostListProps {
  costs: ProjectCost[];
  projectId: string;
}

export function ProjectCostList({ costs, projectId }: ProjectCostListProps) {
  const [isPending, startTransition] = useTransition();
  const [editingCost, setEditingCost] = useState<Cost | null>(null);
  const [deletingCostId, setDeletingCostId] = useState<string | null>(null);

  const { exchangeRate, showInVes, toggleCurrency } = useProjectsStore();

  const handleDeleteConfirm = async () => {
    if (!deletingCostId) return;

    startTransition(async () => {
      const result = await deleteProjectCost(deletingCostId, projectId);

      if (result.success) {
        toast.success(result.message);
        setDeletingCostId(null);
      } else {
        toast.error(result.message);
      }
    });
  };

  const totalCostUSD = costs?.reduce(
    (total, cost) => total + cost.quantity * cost.unit_price,
    0
  ) || 0;

  return (
    <div className="space-y-6">
      {/* Currency Control */}
      {exchangeRate && (
        <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5 border-primary/20">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Tasa de cambio: {exchangeRate.toFixed(2)} VES/USD
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleCurrency}
            className="transition-all"
          >
            {showInVes ? "USD" : "VES"}
          </Button>
        </div>
      )}

      {/* Costs Table */}
      <div className="overflow-hidden border rounded-lg border-border/50">
        <div className="hidden gap-4 p-4 text-sm font-semibold border-b md:grid md:grid-cols-12 bg-muted/50 border-border/50">
          <div className="md:col-span-3">Nombre</div>
          <div className="md:col-span-2">Cantidad</div>
          <div className="md:col-span-2">Precio Unit.</div>
          <div className="md:col-span-2">Subtotal</div>
          <div className="md:col-span-3">Acciones</div>
        </div>

        <div className="p-4 space-y-2 bg-card">
          {costs?.map((cost) => {
            const totalItemCost = cost.quantity * cost.unit_price;
            return (
              <div
                key={cost.id}
                className="grid gap-3 p-4 transition-colors border rounded-lg md:grid-cols-12 md:gap-4 border-border/50 bg-muted/50 hover:border-primary/30"
              >
                {/* Mobile: Full width info */}
                <div className="flex flex-col md:col-span-3">
                  <p className="text-sm font-semibold text-foreground">{cost.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {cost.category && `Categoría: ${cost.category}`}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <p className="mb-1 text-xs text-muted-foreground md:hidden">Cantidad</p>
                  <p className="text-sm font-medium">{cost.quantity}</p>
                </div>

                <div className="md:col-span-2">
                  <p className="mb-1 text-xs text-muted-foreground md:hidden">Precio</p>
                  <p className="text-sm font-medium">
                    ${cost.unit_price.toFixed(2)}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <p className="mb-1 text-xs text-muted-foreground md:hidden">Subtotal</p>
                  <div>
                    <Badge variant="secondary">
                      ${totalItemCost.toFixed(2)}
                    </Badge>
                    {showInVes && exchangeRate && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatCurrency(totalItemCost * exchangeRate, "VES")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 md:col-span-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingCost(cost)}
                    className="gap-1.5 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="hidden sm:inline">Editar</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isPending}
                    onClick={() => setDeletingCostId(cost.id)}
                    className="gap-1.5 hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Eliminar</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Total Summary */}
      <div className="p-4 border rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              Costo Total del Proyecto
            </span>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">
              {formatCurrency(totalCostUSD, "USD")}
            </p>
            {showInVes && exchangeRate && (
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                {formatCurrency(totalCostUSD * exchangeRate, "VES")}
              </p>
            )}
          </div>
        </div>
      </div>

      <EditCostDialog
        cost={editingCost}
        isOpen={!!editingCost}
        onClose={() => setEditingCost(null)}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingCostId} onOpenChange={() => setDeletingCostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Costo</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar este costo? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3 pt-2">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
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