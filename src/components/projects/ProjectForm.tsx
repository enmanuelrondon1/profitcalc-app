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

type Project = Database["public"]["Tables"]["projects"]["Row"];

interface ProjectFormProps {
  project?: Project; // Para poder reutilizar el form para editar
}

const initialState = {
  message: undefined,
  errors: {},
  success: false,
  data: undefined,
};

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
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
    <form action={formAction} className="space-y-4">
      {state?.message && !state.success && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{state.message}</span>
        </div>
      )}
      <div>
        <Label htmlFor="name">Project Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          className="mt-1"
          defaultValue={project?.name || ""}
          required
        />
        {state?.errors?.name && (
          <p className="text-sm text-red-500 mt-1">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          name="description"
          rows={3}
          className="mt-1"
          defaultValue={project?.description || ""}
        />
      </div>

      <div className="flex justify-end">
        <SubmitButton isEditing={!!project} />
      </div>
    </form>
  );
}