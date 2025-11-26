//src/components/projects/ProjectQuantityEditor.tsx

"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  updateProjectQuantity,
  type UpdateQuantityState,
} from "@/app/(routes)/projects/[projectId]/actions";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Package, Edit2, X, CheckCircle2, AlertCircle } from "lucide-react";

interface ProjectQuantityEditorProps {
  projectId: string;
  quantity: number | null;
}

const initialState: UpdateQuantityState = {
  errors: {},
  message: "",
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      size="sm"
      className="gap-1.5 bg-gradient-to-r from-primary to-primary/80"
    >
      {pending ? "Guardando..." : "Guardar"}
    </Button>
  );
}

export function ProjectQuantityEditor({
  projectId,
  quantity,
}: ProjectQuantityEditorProps) {
  const [state, formAction] = useActionState(
    updateProjectQuantity.bind(null, projectId),
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      setIsEditing(false);
      formRef.current?.reset();
    } else if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div className="relative overflow-hidden border rounded-xl border-border/50 bg-card">
      {/* Gradient background */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary/50" />

      <div className="relative p-6 space-y-4 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 border rounded-lg bg-primary/10 border-primary/20">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Cantidad de Unidades
              </h3>
              <p className="text-xs text-muted-foreground">
                Edita la cantidad a vender
              </p>
            </div>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              size="sm"
              variant="outline"
              className="gap-1.5"
            >
              <Edit2 className="w-4 h-4" />
              Editar
            </Button>
          )}
        </div>

        {!isEditing ? (
          // Vista de solo lectura
          <div className="p-4 border rounded-lg bg-muted/50 border-border/50">
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              Cantidad actual
            </p>
            <p className="text-3xl font-bold text-foreground">
              {quantity || 1}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                unidades
              </span>
            </p>
          </div>
        ) : (
          // Formulario de edición
          <form ref={formRef} action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-semibold">
                Nueva Cantidad
              </Label>
              <Input
                type="number"
                id="quantity"
                name="quantity"
                placeholder="40"
                min="1"
                step="1"
                defaultValue={quantity || 1}
                className="h-11 bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                autoFocus
              />
              {state?.errors?.quantity && (
                <p className="flex items-center gap-1 text-xs font-medium text-destructive">
                  <AlertCircle className="w-3 h-3" />
                  {state.errors.quantity[0]}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <SubmitButton />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
                className="gap-1.5"
              >
                <X className="w-4 h-4" />
                Cancelar
              </Button>
            </div>
          </form>
        )}

        {/* Success Message */}
        {state.success && (
          <div className="flex items-center gap-2 p-3 border rounded-lg bg-success/5 border-success/20 animate-in fade-in">
            <CheckCircle2 className="flex-shrink-0 w-4 h-4 text-success" />
            <p className="text-xs font-medium text-success">{state.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
