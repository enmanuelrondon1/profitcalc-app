// src/components/projects/EditCostForm.tsx (VERSIÓN CON TOAST Y CORRECCIÓN)

"use client";

import { useFormStatus } from "react-dom";
import { updateProjectCost } from "@/app/(routes)/projects/[projectId]/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useActionState, useEffect } from "react";
import { costCategories } from "@/lib/utils";
import { Cost } from "@/lib/types";
import { CostState } from "@/app/(routes)/projects/[projectId]/actions";
import { toast } from "sonner"; // <-- CAMBIO 1: Importa toast

// El componente ahora solo recibe el costo y una función de cierre.
interface EditCostFormProps {
  cost: Cost;
  onClose: () => void;
}

const initialState: CostState = {
  message: "",
  errors: {},
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Guardando..." : "Guardar Cambios"}
    </Button>
  );
}

export function EditCostForm({ cost, onClose }: EditCostFormProps) {
  const action = async (prevState: CostState, formData: FormData) => {
    if (!cost.project_id) {
      return {
        ...prevState,
        message: "Error: El ID del proyecto no está disponible.",
        success: false,
      };
    }

    // CORRECCIÓN: La variable estaba mal definida
    const updateProjectCostWithId = updateProjectCost.bind(
      null,
      cost.id,
      cost.project_id
    );
    return updateProjectCostWithId(prevState, formData);
  };

  const [state, formAction] = useActionState(action, initialState);

  useEffect(() => {
    // CAMBIO 2: Añade lógica para mostrar toasts
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
        onClose(); // Cierra el diálogo solo en caso de éxito
      } else {
        toast.error(state.message);
      }
    }
  }, [state.message, state.success, onClose]);

  return (
    <form action={formAction} className="space-y-4">
      {/* Ya no mostramos el mensaje de error aquí, el toast es mejor */}
      
      {/* Campos del formulario... */}
      <div>
        <Label htmlFor="name">Nombre del Costo</Label>
        <Input id="name" name="name" defaultValue={cost.name} required />
        {state.errors?.name && <p className="mt-1 text-sm text-red-500">{state.errors.name[0] ?? ""}</p>}
      </div>
      
      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={cost.description ?? ""}
          placeholder="Añade detalles adicionales sobre este costo..."
          rows={3}
        />
      </div>
      
      <div>
        <Label htmlFor="quantity">Cantidad</Label>
        <Input type="number" id="quantity" name="quantity" step="any" defaultValue={cost.quantity} required />
        {state.errors?.quantity && <p className="mt-1 text-sm text-red-500">{state.errors.quantity[0] ?? ""}</p>}
      </div>
      
      <div>
        <Label htmlFor="unit_price">Costo Unitario ($)</Label>
        <Input type="number" id="unit_price" name="unit_price" step="any" defaultValue={cost.unit_price} required />
        {state.errors?.unit_price && <p className="mt-1 text-sm text-red-500">{state.errors.unit_price[0] ?? ""}</p>}
      </div>
      
      <div>
        <Label htmlFor="category">Categoría</Label>
        <select id="category" name="category" defaultValue={cost.category ?? ""} className="flex items-center justify-between w-full h-10 px-3 py-2 text-sm border rounded-md border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required>
          {costCategories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        {state.errors?.category && <p className="mt-1 text-sm text-red-500">{state.errors.category[0] ?? ""}</p>}
      </div>

      {/* Botones del formulario */}
      <div className="flex justify-end pt-4 space-x-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <SubmitButton />
      </div>
    </form>
  );
}