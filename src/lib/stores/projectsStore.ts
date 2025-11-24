// src/lib/stores/projectsStore.ts

import { create } from 'zustand';
import { Project, Cost } from '@/lib/types'; // Tipos de UI

interface ProjectsState {
  // Estado
  projects: Project[] | null;
  currentProject: Project | null;
  costs: Cost[] | null;
  isLoading: boolean;
  
  // <-- ESTADO PARA LA MONEDA
  exchangeRate: number | null;
  showInVes: boolean;

  // Acciones
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  setCosts: (costs: Cost[]) => void;
  addCost: (cost: Cost) => void;
  updateCost: (costId: string, updatedCost: Partial<Cost>) => void;
  deleteCost: (costId: string) => void; // <-- Acción para borrar un costo del estado
  setLoading: (loading: boolean) => void;
  
  // <-- ACCIONES PARA LA MONEDA
  setExchangeRate: (rate: number | null) => void;
  toggleCurrency: () => void;
}

export const useProjectsStore = create<ProjectsState>((set) => ({
  // Estado inicial
  projects: null,
  currentProject: null,
  costs: null,
  isLoading: false,
  exchangeRate: null, // <-- Estado inicial
  showInVes: false,   // <-- Estado inicial

  // Acciones
  setProjects: (projects) => set({ projects }),
  setCurrentProject: (project) => set({ currentProject: project }),
  setCosts: (costs) => set({ costs }),
  setLoading: (isLoading) => set({ isLoading }),

  addCost: (cost) => set((state) => ({
    costs: state.costs ? [...state.costs, cost] : [cost],
  })),

  updateCost: (costId, updatedCost) =>
    set((state) => ({
      costs: state.costs?.map((cost) =>
        cost.id === costId ? { ...cost, ...updatedCost } : cost
      ),
    })),

  deleteCost: (costId) => // <-- Implementación de la acción de borrar
    set((state) => ({
      costs: state.costs?.filter((cost) => cost.id !== costId),
    })),

  // <-- Implementación de las acciones de moneda
  setExchangeRate: (rate) => set({ exchangeRate: rate }),
  toggleCurrency: () => set((state) => ({ showInVes: !state.showInVes })),
}));