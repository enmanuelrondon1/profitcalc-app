// src/app/(routes)/admin/actions.ts

"use server";

import { createClient } from "@/lib/supabase/server";
import { checkAdminAccess } from "@/lib/adminUtils";

interface UserRole {
  user_id: string;
  role: string;
}

interface User {
  user_id: string;
  email: string | null;
  created_at: string | null;
}

// Obtener todos los usuarios registrados con sus roles
export async function getAllUsers() {
  await checkAdminAccess();
  
  const supabase = await createClient();
  
  // Obtener usuarios
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("user_id, email, created_at")
    .order("created_at", { ascending: false });

  if (usersError) throw new Error("Error al obtener usuarios: " + usersError.message);

  // Obtener roles
  const { data: roles, error: rolesError } = await supabase
    .from("user_roles")
    .select("user_id, role");

  if (rolesError) throw new Error("Error al obtener roles: " + rolesError.message);

  // Crear un mapa de roles por user_id
  const rolesMap = new Map(roles?.map((r: UserRole) => [r.user_id, r.role]) || []);

  // Combinar usuarios con sus roles
  return (users as User[]).map((u) => ({
    user_id: u.user_id,
    email: u.email,
    created_at: u.created_at,
    role: rolesMap.get(u.user_id) || "user",
  }));
}

// Cambiar rol de un usuario
export async function changeUserRole(
  userId: string,
  newRole: "user" | "admin" | "moderator"
) {
  await checkAdminAccess();
  
  const supabase = await createClient();
  
  // Primero verificar si el registro existe
  const { data: existing } = await supabase
    .from("user_roles")
    .select("id")
    .eq("user_id", userId)
    .single();

  let error;

  if (existing) {
    // Si existe, actualizar
    const response = await supabase
      .from("user_roles")
      .update({ role: newRole })
      .eq("user_id", userId);
    error = response.error;
  } else {
    // Si no existe, insertar
    const response = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role: newRole });
    error = response.error;
  }

  if (error) throw new Error("Error al cambiar rol: " + error.message);
  return { success: true };
}

// Obtener proyectos de un usuario específico
export async function getUserProjects(userId: string) {
  await checkAdminAccess();
  
  const supabase = await createClient();
  
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Error al obtener proyectos: " + error.message);
  return projects || [];
}

// Obtener costos de un proyecto
export async function getProjectCosts(projectId: string) {
  await checkAdminAccess();
  
  const supabase = await createClient();
  
  const { data: costs, error } = await supabase
    .from("project_costs")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Error al obtener costos: " + error.message);
  return costs || [];
}

// Eliminar un proyecto (y sus costos asociados)
export async function deleteProject(projectId: string) {
  await checkAdminAccess();
  
  const supabase = await createClient();
  
  // Primero eliminar los costos
  const { error: costsError } = await supabase
    .from("project_costs")
    .delete()
    .eq("project_id", projectId);

  if (costsError) throw new Error("Error al eliminar costos: " + costsError.message);

  // Luego eliminar el proyecto
  const { error: projectError } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (projectError) throw new Error("Error al eliminar proyecto: " + projectError.message);

  return { success: true };
}

// Eliminar todos los proyectos de un usuario
export async function deleteUserProjects(userId: string) {
  await checkAdminAccess();
  
  const supabase = await createClient();
  
  // Obtener todos los proyectos del usuario
  const { data: projects, error: fetchError } = await supabase
    .from("projects")
    .select("id")
    .eq("user_id", userId);

  if (fetchError) throw new Error("Error al obtener proyectos: " + fetchError.message);

  // Eliminar cada proyecto
  for (const project of projects || []) {
    await deleteProject(project.id);
  }

  return { success: true };
}

// Actualizar datos de un proyecto
export async function updateProject(
  projectId: string,
  data: {
    name?: string;
    description?: string;
    selling_price?: number;
  }
) {
  await checkAdminAccess();
  
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("projects")
    .update(data)
    .eq("id", projectId);

  if (error) throw new Error("Error al actualizar proyecto: " + error.message);
  return { success: true };
}