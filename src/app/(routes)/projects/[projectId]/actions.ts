// src/app/(routes)/projects/[projectId]/actions.ts (VERSIÓN CORREGIDA Y FINAL)
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// --- Esquemas de Validación con Zod ---
const costSchema = z.object({
  name: z.string().min(1, "El nombre del costo es requerido."),
  quantity: z.coerce.number().min(0, "La cantidad no puede ser negativa."),
  unit_price: z.coerce.number().min(0, "El costo unitario no puede ser negativo."),
  category: z.string().min(1, "La categoría es requerida."),
});

const sellingPriceSchema = z.object({
  selling_price: z.coerce.number().min(0, "El precio de venta no puede ser negativo."),
});

// --- Tipos de Respuesta para las Acciones ---

export type ActionResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

export type CostState = {
  errors?: {
    name?: string[];
    quantity?: string[];
    unit_price?: string[];
    category?: string[];
  };
  message?: string;
} & ActionResponse<unknown>;

export type SellingPriceState = {
  errors?: {
    selling_price?: string[];
  };
  message?: string;
} & ActionResponse<unknown>;

// --- Funciones de Acción (Server Actions) ---

export async function createProjectCost(
  projectId: string,
  prevState: CostState,
  formData: FormData
): Promise<CostState> {
  const validatedFields = costSchema.safeParse({
    name: formData.get("name"),
    quantity: formData.get("quantity"),
    unit_price: formData.get("unit_price"),
    category: formData.get("category"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Error de validación.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Debes iniciar sesión para añadir costos." };
  }

  const { data, error } = await supabase
    .from("project_costs")
    .insert({ project_id: projectId, user_id: user.id, ...validatedFields.data })
    .select()
    .single();

  if (error) {
    return { success: false, message: `Error de base de datos: ${error.message}` };
  }

  // ✅ AGREGADO: Revalida la página para refrescar los datos
  revalidatePath(`/projects/${projectId}`);

  return {
    success: true,
    message: "Costo añadido con éxito.",
    data: { newCost: data },
  };
}

export async function updateProjectSellingPrice(
  projectId: string,
  prevState: SellingPriceState,
  formData: FormData
): Promise<SellingPriceState> {
  const validatedFields = sellingPriceSchema.safeParse({ 
    selling_price: formData.get("selling_price") 
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Error de validación.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({ selling_price: validatedFields.data.selling_price })
    .eq("id", projectId);

  if (error) {
    return { success: false, message: `Error de base de datos: ${error.message}` };
  }

  // ✅ AGREGADO: Revalida la página para refrescar los datos
  revalidatePath(`/projects/${projectId}`);

  return {
    success: true,
    message: "Precio de venta actualizado con éxito.",
    data: { newSellingPrice: validatedFields.data.selling_price },
  };
}

export async function updateProjectCost(
  costId: string,
  projectId: string,
  prevState: CostState,
  formData: FormData
): Promise<CostState> {
  const validatedFields = costSchema.safeParse({
    name: formData.get("name"),
    quantity: formData.get("quantity"),
    unit_price: formData.get("unit_price"),
    category: formData.get("category"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Error de validación.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_costs")
    .update(validatedFields.data)
    .eq("id", costId)
    .select()
    .single();

  if (error) {
    return { success: false, message: `Error de base de datos: ${error.message}` };
  }

  // ✅ AGREGADO: Revalida la página para refrescar los datos
  revalidatePath(`/projects/${projectId}`);

  return {
    success: true,
    message: "Costo actualizado con éxito.",
    data: { updatedCost: data },
  };
}

export async function deleteProjectCost(
  costId: string,
  projectId: string,
): Promise<ActionResponse<{ costId: string }>> {
  const supabase = await createClient();
  const { error } = await supabase.from("project_costs").delete().eq("id", costId);

  if (error) {
    return { success: false, message: `Error de base de datos: ${error.message}` };
  }

  // ✅ AGREGADO: Revalida la página para refrescar los datos
  revalidatePath(`/projects/${projectId}`);

  return { success: true, message: "Costo eliminado con éxito.", data: { costId } };
}