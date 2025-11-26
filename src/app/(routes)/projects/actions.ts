//src/app/(routes)/projects/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Project } from "@/lib/types";

// Esquema de validación actualizado CON quantity
const projectSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  description: z.string().optional(),
  quantity: z.coerce
    .number()
    .min(1, "La cantidad debe ser al menos 1.")
    .default(1),
});

export type ProjectState = {
  errors?: {
    name?: string[];
    description?: string[];
    quantity?: string[];
  };
  message?: string;
  success?: boolean;
  data?: Project;
};

export async function createProject(
  prevState: ProjectState,
  formData: FormData
): Promise<ProjectState> {
  const validatedFields = projectSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    quantity: formData.get("quantity"),
  });

  // Si la validación falla, devolvemos los errores
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { message: "Debes iniciar sesión para crear un proyecto.", success: false };
  }

  // Insertar con quantity incluido
  const { data, error } = await supabase
    .from("projects")
    .insert({
      name: validatedFields.data.name,
      description: validatedFields.data.description || null,
      quantity: validatedFields.data.quantity,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    return { message: `Error al crear el proyecto: ${error.message}`, success: false };
  }

  revalidatePath("/projects");
  return { message: "Proyecto creado con éxito.", success: true, data };
}