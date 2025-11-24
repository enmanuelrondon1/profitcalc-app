// src/components/projects/EditCostDialog.tsx (NUEVO COMPONENTE)

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditCostForm } from "./EditCostForm";
import { Cost } from "@/lib/types";

interface EditCostDialogProps {
  cost: Cost | null; // Puede ser null si no hay costo seleccionado
  isOpen: boolean;
  onClose: () => void;
}

export function EditCostDialog({ cost, isOpen, onClose }: EditCostDialogProps) {
  // Si no hay costo o el diálogo no está abierto, no renderizamos nada.
  if (!cost || !isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Costo</DialogTitle>
        </DialogHeader>
        {/* Aquí renderizamos el formulario puro dentro del diálogo */}
        <EditCostForm cost={cost} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}