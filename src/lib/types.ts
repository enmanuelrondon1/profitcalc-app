// src/lib/types.ts

// --- IMPORTACIONES DESDE LA BASE DE DATOS ---
import { Database } from "./supabase/database.types";

export type DbProject = Database["public"]["Tables"]["projects"]["Row"];
export type DbProjectCost = Database["public"]["Tables"]["project_costs"]["Row"];
export type DbReusableCost = Database["public"]["Tables"]["reusable_costs"]["Row"];

// --- TIPOS DE DOMINIO / UI ---
// Estos son los tipos que tu aplicación entiende. Son limpios, seguros y predecibles.

export interface Project {
  id: string;
  name: string;
  description: string | null;
  created_at: string | null;
  user_id: string | null;
  profit: number | null;
  sale_price: number | null;
  selling_price: number | null;
  total_cost: number | null;
  is_favorite: boolean | null;
  quantity: number | null; // ✅ NUEVO: Cantidad de unidades
}

export interface Cost {
  id: string;
  name: string;
  description: string | null;
  quantity: number;
  unit_price: number;
  project_id: string | null;
  category: string | null;
  created_at: string | null;
  user_id: string | null;
}

export interface ReusableCost {
  id: string;
  name: string;
  unit_price: number;
  category?: string;
}

// --- TIPOS ESPECÍFICOS PARA VISTAS O LÓGICA COMPLEJA ---

// Tipo para un proyecto que ya incluye su lista de costos.
export interface ProjectWithCosts extends Project {
  project_costs: Cost[];
}

// Tipo para costos con categoría garantizada (no nula)
export interface ProjectCost extends Cost {
  category: string; // No es nulo
}

// Datos para el gráfico
export interface ChartData {
  name: string;
  value: number;
  fill: string;
}

// ✅ NUEVO: Tipo para cálculos de rentabilidad por unidad
export interface ProfitCalculation {
  totalCost: number;
  quantity: number;
  costPerUnit: number;
  sellingPrice: number | null;
  pricePerUnit: number | null;
  totalProfit: number | null;
  profitPerUnit: number | null;
  profitMargin: number | null;
  isProfitable: boolean;
}