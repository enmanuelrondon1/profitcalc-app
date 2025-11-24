// src/components/projects/ProjectCostList.tsx

"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
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
    <div className="mt-8">
      {/* Control de Moneda */}
      {exchangeRate ? (
        <div className="flex items-center my-6 space-x-2">
          <Button variant="outline" size="sm" onClick={toggleCurrency}>
            {showInVes ? "Mostrar en USD" : "Mostrar en VES"}
          </Button>
          <span className="text-sm text-muted-foreground">
            Tasa: {exchangeRate.toFixed(2)}
          </span>
        </div>
      ) : (
        <div className="p-3 my-6 text-sm border rounded-lg text-muted-foreground bg-muted/50">
          <p>No se pudo obtener la tasa de cambio.</p>
        </div>
      )}

      <h2 className="mb-4 text-xl font-semibold">Lista de Costos</h2>
      <ul className="space-y-3">
        {costs?.map((cost) => {
          const totalItemCost = cost.quantity * cost.unit_price;
          return (
            <li
              key={cost.id}
              className="flex items-center justify-between p-3 border rounded-lg bg-card"
            >
              <div>
                <p className="font-medium">{cost.name}</p>
                <p className="text-sm text-muted-foreground">
                  {cost.quantity} x {formatCurrency(cost.unit_price, "USD")}
                </p>
              </div>
              <div className="text-right">
                <Badge variant="secondary">
                  {formatCurrency(totalItemCost, "USD")}
                </Badge>
                {showInVes && exchangeRate && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatCurrency(totalItemCost * exchangeRate, "VES")}
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingCost(cost)}
                >
                  <Edit className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isPending}
                  onClick={() => setDeletingCostId(cost.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Total del Proyecto */}
      <div className="pt-4 mt-6 border-t">
        <div className="flex items-center justify-between text-lg font-bold">
          <span>Costo Total del Proyecto:</span>
          <div className="text-right">
            <span>{formatCurrency(totalCostUSD, "USD")}</span>
            {showInVes && exchangeRate && (
              <p className="text-sm font-normal text-muted-foreground">
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

      {/* AlertDialog para confirmar eliminación */}
      <AlertDialog open={!!deletingCostId} onOpenChange={() => setDeletingCostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar este costo? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}