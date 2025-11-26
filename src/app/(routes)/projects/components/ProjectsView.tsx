// src/app/(routes)/projects/components/ProjectsView.tsx
"use client";

import { useState, useMemo, useTransition } from "react";
import { useOptimistic } from "react";
import { ProjectsHeader } from "./ProjectsHeader";
import { ProjectsGrid } from "./ProjectsGrid";
import { ProjectsTable } from "./ProjectsTable";
import { ProjectsStats } from "./ProjectsStats";
import { ViewType, FilterType, SortType } from "./types";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Database } from "@/lib/supabase/database.types";
import { User } from "@supabase/supabase-js";

type Project = Database["public"]["Tables"]["projects"]["Row"];

type OptimisticAction =
  | {
      type: "TOGGLE_FAVORITE";
      payload: { projectId: string; is_favorite: boolean };
    }
  | { type: "DELETE_PROJECT"; payload: { projectId: string } }
  | { type: "DELETE_MULTIPLE"; payload: { projectIds: string[] } }
  | {
      type: "DUPLICATE_PROJECT";
      payload: { originalProject: Project; newProject: Project };
    };

type DeleteConfirmType = 
  | { type: "single"; projectId: string }
  | { type: "multiple"; projectIds: string[] }
  | null;

interface ProjectsViewProps {
  user: User;
  initialProjects: Project[];
}

export function ProjectsView({ user, initialProjects }: ProjectsViewProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Estados de UI
  const [searchTerm, setSearchTerm] = useState("");
  const [viewType, setViewType] = useState<ViewType>("grid");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortType, setSortType] = useState<SortType>("newest");
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(
    new Set()
  );

  // Estado del diálogo de confirmación
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmType>(null);

  // Optimistic updates
  const [optimisticProjects, setOptimisticProjects] = useOptimistic<
    Project[],
    OptimisticAction
  >(projects, (state, action) => {
    switch (action.type) {
      case "TOGGLE_FAVORITE":
        return state.map((project) =>
          project.id === action.payload.projectId
            ? { ...project, is_favorite: action.payload.is_favorite }
            : project
        );
      case "DELETE_PROJECT":
        return state.filter(
          (project) => project.id !== action.payload.projectId
        );
      case "DELETE_MULTIPLE":
        return state.filter(
          (project) => !action.payload.projectIds.includes(project.id)
        );
      case "DUPLICATE_PROJECT":
        return [...state, action.payload.newProject];
      default:
        return state;
    }
  });

  // Cálculo de estadísticas
  const stats = useMemo(() => {
    const totalProjects = optimisticProjects.length;
    const profitableProjects = optimisticProjects.filter(
      (p) => (p.profit || 0) > 0
    ).length;
    const totalRevenue = optimisticProjects.reduce(
      (sum, p) => sum + (p.selling_price || 0),
      0
    );
    const totalProfit = optimisticProjects.reduce(
      (sum, p) => sum + (p.profit || 0),
      0
    );

    return {
      totalProjects,
      profitableProjects,
      unprofitableProjects: totalProjects - profitableProjects,
      totalRevenue,
      avgProfitability:
        totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
    };
  }, [optimisticProjects]);

  // Filtrado y ordenamiento
  const filteredAndSortedProjects = useMemo(() => {
    const filtered = optimisticProjects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterType === "all" ||
        (filterType === "profitable" && (project.profit || 0) > 0) ||
        (filterType === "unprofitable" && (project.profit || 0) <= 0);

      return matchesSearch && matchesFilter;
    });

    return filtered.sort((a, b) => {
      switch (sortType) {
        case "newest":
          return (
            new Date(b.created_at || 0).getTime() -
            new Date(a.created_at || 0).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at || 0).getTime() -
            new Date(b.created_at || 0).getTime()
          );
        case "most-profitable":
          return (b.profit || 0) - (a.profit || 0);
        case "least-profitable":
          return (a.profit || 0) - (b.profit || 0);
        case "highest-cost":
          return (b.total_cost || 0) - (a.total_cost || 0);
        case "lowest-cost":
          return (a.total_cost || 0) - (b.total_cost || 0);
        default:
          return 0;
      }
    });
  }, [optimisticProjects, searchTerm, filterType, sortType]);

  // Handlers
  const handleToggleFavorite = async (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    const currentFavoriteStatus = project.is_favorite ?? false;
    const newFavoriteStatus = !currentFavoriteStatus;

    startTransition(() => {
      setOptimisticProjects({
        type: "TOGGLE_FAVORITE",
        payload: { projectId, is_favorite: newFavoriteStatus },
      });
    });

    try {
      const { error } = await supabase
        .from("projects")
        .update({ is_favorite: newFavoriteStatus })
        .eq("id", projectId);

      if (error) throw error;

      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId ? { ...p, is_favorite: newFavoriteStatus } : p
        )
      );

      toast.success(
        newFavoriteStatus
          ? "Proyecto marcado como favorito"
          : "Proyecto desmarcado como favorito"
      );
    } catch (error) {
      setOptimisticProjects({
        type: "TOGGLE_FAVORITE",
        payload: { projectId, is_favorite: currentFavoriteStatus },
      });
      toast.error("Error al actualizar favorito");
    }
  };

  const handleDuplicateProject = async (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    setIsLoading(true);

    try {
      const { data: newProject, error: insertError } = await supabase
        .from("projects")
        .insert({
          name: `${project.name} (Copia)`,
          description: project.description,
          user_id: project.user_id,
          total_cost: project.total_cost,
          selling_price: project.selling_price,
          sale_price: project.sale_price,
          profit: project.profit,
          is_favorite: false,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      startTransition(() => {
        setOptimisticProjects({
          type: "DUPLICATE_PROJECT",
          payload: { originalProject: project, newProject },
        });
      });

      setProjects((prev) => [...prev, newProject]);
      toast.success("Proyecto duplicado exitosamente");
    } catch (error) {
      toast.error("Error al duplicar proyecto");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    setDeleteConfirm({ type: "single", projectId });
  };

  const confirmDeleteProject = async () => {
    if (deleteConfirm?.type !== "single") return;

    const projectId = deleteConfirm.projectId;

    startTransition(() => {
      setOptimisticProjects({
        type: "DELETE_PROJECT",
        payload: { projectId },
      });
    });

    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) throw error;

      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      toast.success("Proyecto eliminado exitosamente");
      setDeleteConfirm(null);
    } catch (error) {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        setOptimisticProjects({
          type: "DUPLICATE_PROJECT",
          payload: { originalProject: project, newProject: project },
        });
      }
      toast.error("Error al eliminar proyecto");
    }
  };

  const handleDeleteMultiple = (projectIds: string[]) => {
    setDeleteConfirm({ type: "multiple", projectIds });
  };

  const confirmDeleteMultiple = async () => {
    if (deleteConfirm?.type !== "multiple") return;

    const projectIds = deleteConfirm.projectIds;

    startTransition(() => {
      setOptimisticProjects({
        type: "DELETE_MULTIPLE",
        payload: { projectIds },
      });
    });

    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .in("id", projectIds);

      if (error) throw error;

      setProjects((prev) => prev.filter((p) => !projectIds.includes(p.id)));
      setSelectedProjects(new Set());
      toast.success(
        `${projectIds.length} proyecto${
          projectIds.length !== 1 ? "s" : ""
        } eliminado${projectIds.length !== 1 ? "s" : ""} exitosamente`
      );
      setDeleteConfirm(null);
    } catch (error) {
      const revertedProjects = [...projects];
      if (revertedProjects.length > 0) {
        setOptimisticProjects({
          type: "DUPLICATE_PROJECT",
          payload: {
            originalProject: revertedProjects[0],
            newProject: revertedProjects[0],
          },
        });
      }
      toast.error("Error al eliminar proyectos");
    }
  };

  const getConfirmMessage = () => {
    if (!deleteConfirm) return "";
    if (deleteConfirm.type === "single") {
      const project = projects.find((p) => p.id === deleteConfirm.projectId);
      return `¿Está seguro de que desea eliminar el proyecto "${project?.name}"? Esta acción no se puede deshacer.`;
    }
    return `¿Está seguro de que desea eliminar ${deleteConfirm.projectIds.length} proyecto${
      deleteConfirm.projectIds.length !== 1 ? "s" : ""
    }? Esta acción no se puede deshacer.`;
  };

  return (
    <div className="space-y-6">
      <ProjectsHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        viewType={viewType}
        onViewTypeChange={setViewType}
        filterType={filterType}
        onFilterTypeChange={setFilterType}
        sortType={sortType}
        onSortTypeChange={setSortType}
        totalProjects={filteredAndSortedProjects.length}
        isLoading={isLoading || isPending}
      />

      <ProjectsStats stats={stats} />

      {viewType === "grid" ? (
        <ProjectsGrid
          projects={filteredAndSortedProjects}
          onDuplicate={handleDuplicateProject}
          onDelete={handleDeleteProject}
          onToggleFavorite={handleToggleFavorite}
          selectedProjects={selectedProjects}
          onSelectionChange={setSelectedProjects}
          onDeleteMultiple={handleDeleteMultiple}
          isLoading={isLoading || isPending}
        />
      ) : (
        <ProjectsTable
          projects={filteredAndSortedProjects}
          onDuplicate={handleDuplicateProject}
          onDelete={handleDeleteProject}
          onToggleFavorite={handleToggleFavorite}
          selectedProjects={selectedProjects}
          onSelectionChange={setSelectedProjects}
          onDeleteMultiple={handleDeleteMultiple}
          isLoading={isLoading || isPending}
        />
      )}

      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        message={getConfirmMessage()}
        onConfirm={
          deleteConfirm?.type === "single"
            ? confirmDeleteProject
            : confirmDeleteMultiple
        }
        onCancel={() => setDeleteConfirm(null)}
        isPending={isPending}
      />
    </div>
  );
}