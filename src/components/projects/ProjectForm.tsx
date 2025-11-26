//src/components/projects/ProjectForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Database } from "@/lib/supabase/database.types";
import { useFormStatus } from "react-dom";
import { createProject } from "@/app/(routes)/projects/actions";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { AlertCircle, Package } from "lucide-react";

type Project = Database["public"]["Tables"]["projects"]["Row"];

interface ProjectFormProps {
  project?: Project;
}

const initialState = {
  message: undefined,
  errors: {
    name: undefined,
    description: undefined,
    quantity: undefined,
  },
  success: false,
  data: undefined,
};

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full gap-2">
      {pending
        ? "Guardando..."
        : isEditing
        ? "Guardar Cambios"
        : "Crear Proyecto"}
    </Button>
  );
}

export function ProjectForm({ project }: ProjectFormProps) {
  const [state, formAction] = useActionState(createProject, initialState);

  useEffect(() => {
    if (state.success && state.data) {
      toast.success(state.message);
      redirect(`/projects/${state.data.id}`);
    } else if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
      {state?.message && !state.success && (
        <div className="flex items-start gap-3 p-4 border rounded-lg bg-destructive/5 border-destructive/20">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{state.message}</p>
        </div>
      )}

      {/* Nombre del Proyecto */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-semibold">
          Nombre del Proyecto
        </Label>
        <Input
          type="text"
          id="name"
          name="name"
          placeholder="Ej: Venta de perros calientes"
          className="h-11 bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
          defaultValue={project?.name || ""}
          required
        />
        {state?.errors?.name && (
          <p className="flex items-center gap-1 text-xs font-medium text-destructive">
            <AlertCircle className="w-3 h-3" />
            {state.errors.name[0]}
          </p>
        )}
      </div>

      {/* Descripción */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-semibold">
          Descripción (Opcional)
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Ej: Todos los lines de semana voy a vender perros calientes, días viernes, sábados y domingos."
          rows={3}
          className="bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
          defaultValue={project?.description || ""}
        />
        {state?.errors?.description && (
          <p className="flex items-center gap-1 text-xs font-medium text-destructive">
            <AlertCircle className="w-3 h-3" />
            {state.errors.description[0]}
          </p>
        )}
      </div>

      {/* Cantidad de Unidades */}
      <div className="space-y-2">
        <Label htmlFor="quantity" className="flex items-center gap-2 text-sm font-semibold">
          <Package className="w-4 h-4 text-muted-foreground" />
          Cantidad de Unidades a Vender
        </Label>
        <p className="text-xs text-muted-foreground">
          ¿Cuántas unidades piensas vender? (Ej: 40 perros calientes)
        </p>
        <Input
          type="number"
          id="quantity"
          name="quantity"
          placeholder="40"
          min="1"
          step="1"
          className="h-11 bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
          defaultValue={project?.quantity || "1"}
          required
        />
        {state?.errors?.quantity && (
          <p className="flex items-center gap-1 text-xs font-medium text-destructive">
            <AlertCircle className="w-3 h-3" />
            {state.errors.quantity[0]}
          </p>
        )} 
      </div>

      <div className="flex justify-end pt-2">
        <SubmitButton isEditing={!!project} />
      </div>
    </form>
  );
}