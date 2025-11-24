//src/app/(routes)/costs/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { toast } from "sonner";

// Esquema de validación para un costo reutilizable
const reusableCostSchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  unit_price: z.coerce.number().min(0, "El precio unitario no puede ser negativo."),
  category: z.string().min(1, "La categoría es requerida."),
});

export type ReusableCostState = {
  errors?: {
    name?: string[];
    unit_price?: string[];
    category?: string[];
  };
  message?: string;
};

export async function createReusableCost(prevState: ReusableCostState, formData: FormData): Promise<ReusableCostState> {
  const validatedFields = reusableCostSchema.safeParse({
    name: formData.get("name"),
    unit_price: formData.get("unit_price"),
    category: formData.get("category"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    toast.error("Debes iniciar sesión para crear un costo.");
    return { message: "No autorizado." };
  }

  const { error } = await supabase.from("reusable_costs").insert({
    ...validatedFields.data,
    user_id: user.id,
  });

  if (error) {
    toast.error(`Error al crear el costo: ${error.message}`);
    return { message: "Error en la base de datos." };
  }

  revalidatePath("/costs");
  toast.success("Costo reutilizable creado con éxito.");
  return { message: "Costo creado." };
}

export async function deleteReusableCost(costId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("reusable_costs").delete().eq("id", costId);

  if (error) {
    toast.error(`Error al eliminar el costo: ${error.message}`);
    return;
  }

  revalidatePath("/costs");
  toast.success("Costo eliminado con éxito.");
}