// src/app/(routes)/projects/[projectId]/actions.ts 
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

// --- Función auxiliar para calcular y actualizar totales ---

async function updateProjectTotals(projectId: string): Promise<void> {
  const supabase = await createClient();

  try {
    // 1. Obtener todos los costos del proyecto
    const { data: costs, error: costsError } = await supabase
      .from("project_costs")
      .select("quantity, unit_price")
      .eq("project_id", projectId);

    if (costsError) throw costsError;

    // 2. Calcular el costo total
    const totalCost =
      costs?.reduce((sum, cost) => sum + cost.quantity * cost.unit_price, 0) || 0;

    // 3. Obtener el proyecto actual para acceder a selling_price y quantity
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("selling_price, quantity")
      .eq("id", projectId)
      .single();

    if (projectError) throw projectError;

    // 4. Calcular la ganancia
    const sellingPrice = project?.selling_price || 0;
    const profit = sellingPrice - totalCost;

    // 5. Actualizar el proyecto con los nuevos valores
    const { error: updateError } = await supabase
      .from("projects")
      .update({
        total_cost: totalCost,
        profit: profit,
      })
      .eq("id", projectId);

    if (updateError) throw updateError;
  } catch (error) {
    console.error("Error updating project totals:", error);
    throw error;
  }
}

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

  // 🔄 Actualizar los totales del proyecto
  try {
    await updateProjectTotals(projectId);
  } catch (error) {
    console.error("Error al actualizar totales del proyecto:", error);
  }

  // ✅ Revalida la página para refrescar los datos
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");

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

  // 🔄 Actualizar los totales del proyecto
  try {
    await updateProjectTotals(projectId);
  } catch (error) {
    console.error("Error al actualizar totales del proyecto:", error);
  }

  // ✅ Revalida la página para refrescar los datos
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");

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

  // 🔄 Actualizar los totales del proyecto
  try {
    await updateProjectTotals(projectId);
  } catch (error) {
    console.error("Error al actualizar totales del proyecto:", error);
  }

  // ✅ Revalida la página para refrescar los datos
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");

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

  // 🔄 Actualizar los totales del proyecto
  try {
    await updateProjectTotals(projectId);
  } catch (error) {
    console.error("Error al actualizar totales del proyecto:", error);
  }

  // ✅ Revalida la página para refrescar los datos
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");

  return { success: true, message: "Costo eliminado con éxito.", data: { costId } };
}

// --- NUEVA FUNCIÓN: Actualizar cantidad ---

const updateQuantitySchema = z.object({
  quantity: z.coerce
    .number()
    .min(1, "La cantidad debe ser al menos 1."),
});

export type UpdateQuantityState = {
  errors?: {
    quantity?: string[];
  };
  message?: string;
  success?: boolean;
};

export async function updateProjectQuantity(
  projectId: string,
  prevState: UpdateQuantityState,
  formData: FormData
): Promise<UpdateQuantityState> {
  const validatedFields = updateQuantitySchema.safeParse({
    quantity: formData.get("quantity"),
  });

  if (!validatedFields.success) {
    return {
      message: "Error de validación.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({ quantity: validatedFields.data.quantity })
    .eq("id", projectId);

  if (error) {
    return {
      message: `Error de base de datos: ${error.message}`,
      success: false,
    };
  }

  // 🔄 Actualizar los totales del proyecto
  try {
    await updateProjectTotals(projectId);
  } catch (error) {
    console.error("Error al actualizar totales del proyecto:", error);
  }

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");

  return {
    success: true,
    message: "Cantidad actualizada con éxito.",
  };
}