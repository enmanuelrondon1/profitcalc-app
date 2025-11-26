// src/lib/adminUtils.ts
import { createClient } from "@/lib/supabase/server";

export async function isUserAdmin(userId: string): Promise<boolean> {
  const supabase = await createClient();
  
  // Primero verificar si está en la tabla admin_users (método antiguo)
  const { data: adminData } = await supabase
    .from("admin_users")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (adminData) return true;

  // Luego verificar los roles en la tabla user_roles (método nuevo)
  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .single();

  return roleData?.role === "admin" || roleData?.role === "moderator";
}

export async function getUserRole(userId: string): Promise<"user" | "admin" | "moderator"> {
  const supabase = await createClient();
  
  // Verificar roles en la tabla user_roles
  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .single();

  if (roleData?.role === "admin" || roleData?.role === "moderator") {
    return roleData.role;
  }

  // Si no tiene rol específico, verificar si está en admin_users
  const { data: adminData } = await supabase
    .from("admin_users")
    .select("id")
    .eq("user_id", userId)
    .single();

  return adminData ? "admin" : "user";
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function checkAdminAccess() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("No autenticado");
  }

  const hasAdminAccess = await isUserAdmin(user.id);
  
  if (!hasAdminAccess) {
    throw new Error("No tienes permisos de administrador");
  }

  return user;
}