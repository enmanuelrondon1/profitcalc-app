// src/lib/mappers.ts

import { DbProject, DbProjectCost, DbReusableCost } from './types';
import { Project, Cost, ReusableCost } from './types';

// Mapeador para Proyectos
export const mapDbProjectToProject = (dbProject: DbProject): Project => {
  return {
    id: dbProject.id,
    name: dbProject.name,
    description: dbProject.description,
    created_at: dbProject.created_at,
    user_id: dbProject.user_id,
    profit: dbProject.profit,
    sale_price: dbProject.sale_price,
    selling_price: dbProject.selling_price,
    total_cost: dbProject.total_cost,
  };
};

// Mapeador para Costos (manejando el campo `category` que puede ser null)
export const mapDbProjectCostToCost = (dbCost: DbProjectCost): Cost => {
  return {
    id: dbCost.id,
    name: dbCost.name,
    description: dbCost.description,
    quantity: dbCost.quantity,
    unit_price: dbCost.unit_price,
    project_id: dbCost.project_id,
    category: dbCost.category ?? 'Sin Categoría',
    created_at: dbCost.created_at,
    user_id: dbCost.user_id,
  };
};

// Mapeador para un array de costos
export const mapDbProjectCostsToCosts = (dbCosts: DbProjectCost[]): Cost[] => {
  return dbCosts.map(mapDbProjectCostToCost);
};

// Mapeador para Costos Reutilizables
export const mapDbReusableCostToReusableCost = (dbCost: DbReusableCost): ReusableCost => {
  return {
    id: dbCost.id,
    name: dbCost.name,
    unit_price: dbCost.unit_price,
  };
};