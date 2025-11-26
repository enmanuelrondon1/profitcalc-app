"use client";

import { useState } from "react";
import { deleteProject, getProjectCosts } from "@/app/(routes)/admin/actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import type { Cost } from "@/lib/types";

interface User {
  user_id: string;
  created_at: string;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  profit: number | null;
  total_cost: number | null;
  selling_price: number | null;
  created_at: string | null;
}

interface AdminProjectsModalProps {
  user: User;
  projects: Project[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminProjectsModal({
  user,
  projects,
  open,
  onOpenChange,
}: AdminProjectsModalProps) {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [projectCosts, setProjectCosts] = useState<Record<string, Cost[]>>({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExpandProject = async (projectId: string) => {
    if (expandedProject === projectId) {
      setExpandedProject(null);
    } else {
      try {
        setLoading(true);
        const costs = await getProjectCosts(projectId);
        setProjectCosts((prev) => ({ ...prev, [projectId]: costs as Cost[] }));
        setExpandedProject(projectId);
      } catch (error) {
        toast.error("Error al cargar costos");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteProject = async (project: Project) => {
    try {
      setLoading(true);
      await deleteProject(project.id);
      toast.success("Proyecto eliminado");
      setShowDeleteDialog(false);
      onOpenChange(false);
      window.location.reload();
    } catch (error) {
      toast.error("Error al eliminar proyecto");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (project: Project) => {
    setProjectToDelete(project);
    setShowDeleteDialog(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Proyectos del usuario{" "}
              <code className="px-2 py-1 font-mono text-xs rounded bg-muted">
                {user.user_id.substring(0, 8)}...
              </code>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {projects.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                Este usuario no tiene proyectos
              </div>
            ) : (
              projects.map((project) => (
                <Card key={project.id} className="p-4 border-border/40">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 cursor-pointer" onClick={() => handleExpandProject(project.id)}>
                      <div className="flex items-center gap-2">
                        {expandedProject === project.id ? (
                          <ChevronUp className="w-4 h-4 text-primary" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                        <div>
                          <h4 className="font-semibold">{project.name}</h4>
                          {project.description && (
                            <p className="text-sm text-muted-foreground">{project.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDeleteDialog(project)}
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Información de costos */}
                  <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-muted-foreground">Costo Total</p>
                      <p className="font-semibold text-primary">
                        ${(project.total_cost || 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-muted-foreground">Precio Venta</p>
                      <p className="font-semibold">
                        ${(project.selling_price || 0).toFixed(2)}
                      </p>
                    </div>
                    <div className={`p-2 rounded ${project.profit && project.profit > 0 ? "bg-green-500/10" : "bg-red-500/10"}`}>
                      <p className="text-muted-foreground">Ganancia</p>
                      <p className={`font-semibold ${project.profit && project.profit > 0 ? "text-green-600" : "text-red-600"}`}>
                        ${(project.profit || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Costos expandidos */}
                  {expandedProject === project.id && (
                    <div className="pt-4 mt-4 space-y-2 border-t border-border/40">
                      <p className="text-sm font-semibold text-muted-foreground">Costos:</p>
                      {projectCosts[project.id]?.length === 0 ? (
                        <p className="text-xs text-muted-foreground">Sin costos registrados</p>
                      ) : (
                        <div className="space-y-1">
                          {projectCosts[project.id]?.map((cost) => (
                            <div key={cost.id} className="flex justify-between p-2 text-xs rounded bg-background">
                              <span>{cost.name}</span>
                              <span className="text-muted-foreground">
                                {cost.quantity}x ${cost.unit_price.toFixed(2)} = $
                                {(cost.quantity * cost.unit_price).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <p className="mt-3 text-xs text-muted-foreground">
                    Creado: {new Date(project.created_at || "").toLocaleDateString("es-ES")}
                  </p>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación de eliminación de proyecto */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              ¿Eliminar proyecto?
            </AlertDialogTitle>
            <AlertDialogDescription>
              El proyecto <strong>&quot;{projectToDelete?.name}&quot;</strong> y todos sus costos serán
              eliminados permanentemente. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => projectToDelete && handleDeleteProject(projectToDelete)}
              disabled={loading}
              className="bg-destructive hover:bg-destructive/90"
            >
              Eliminar proyecto
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}