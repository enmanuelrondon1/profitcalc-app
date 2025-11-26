// src/app/(routes)/projects/components/ProjectsGrid.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  MoreVertical, 
  Star, 
  Copy, 
  Trash2, 
  CheckSquare, 
  Square 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDate } from './utils';
import { Database } from '@/lib/supabase/database.types';

type Project = Database['public']['Tables']['projects']['Row'];

interface ProjectsGridProps {
  projects: Project[];
  onDuplicate: (projectId: string) => void;
  onDelete: (projectId: string) => void;
  onToggleFavorite: (projectId: string) => void;
  selectedProjects: Set<string>;
  onSelectionChange: (selected: Set<string>) => void;
  onDeleteMultiple: (projectIds: string[]) => void;
  isLoading: boolean;
}

export function ProjectsGrid({
  projects,
  onDuplicate,
  onDelete,
  onToggleFavorite,
  selectedProjects,
  onSelectionChange,
  onDeleteMultiple,
  isLoading
}: ProjectsGridProps) {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  const toggleProjectSelection = (projectId: string) => {
    const newSelected = new Set(selectedProjects);
    if (newSelected.has(projectId)) {
      newSelected.delete(projectId);
    } else {
      newSelected.add(projectId);
    }
    onSelectionChange(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedProjects.size === projects.length) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(projects.map(p => p.id)));
    }
  };

  const handleDeleteSelected = () => {
    const projectIds = Array.from(selectedProjects);
    onDeleteMultiple(projectIds);
  };

  const handleDuplicateSelected = () => {
    projects
      .filter(p => selectedProjects.has(p.id))
      .forEach(p => onDuplicate(p.id));
  };

  return (
    <div className="space-y-4">
      {/* Barra de herramientas */}
      {selectedProjects.size > 0 && (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
          <span className="text-sm text-muted-foreground">
            {selectedProjects.size} proyecto{selectedProjects.size !== 1 ? 's' : ''} seleccionado{selectedProjects.size !== 1 ? 's' : ''}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDuplicateSelected}
              disabled={isLoading}
            >
              <Copy className="w-4 h-4 mr-1" />
              Duplicar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteSelected}
              disabled={isLoading}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Eliminar
            </Button>
          </div>
        </div>
      )}

      {/* Grid de proyectos */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="relative group"
            onMouseEnter={() => setHoveredProject(project.id)}
            onMouseLeave={() => setHoveredProject(null)}
          >
            {/* Checkbox de selección */}
            <div className="absolute z-10 transition-opacity opacity-0 top-3 left-3 group-hover:opacity-100">
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-1 rounded-full bg-background/80 backdrop-blur-sm"
                onClick={() => toggleProjectSelection(project.id)}
                disabled={isLoading}
              >
                {selectedProjects.has(project.id) ? (
                  <CheckSquare className="w-4 h-4 text-primary" />
                ) : (
                  <Square className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </div>

            {/* Botón de favorito - SIEMPRE VISIBLE */}
            <div className="absolute z-10 transition-opacity top-3 right-3">
              <Button
                variant="ghost"
                size="sm"
                className={`w-8 h-8 p-1 rounded-full backdrop-blur-sm transition-all ${
                  project.is_favorite 
                    ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30' 
                    : 'bg-background/80 text-muted-foreground hover:bg-background/100 hover:text-yellow-500'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  onToggleFavorite(project.id);
                }}
                disabled={isLoading}
              >
                <Star className={`w-4 h-4 ${project.is_favorite ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Card del proyecto */}
            <Link href={`/projects/${project.id}`} className="block">
              <div className={`h-full overflow-hidden transition-all duration-300 border rounded-xl ${
                selectedProjects.has(project.id) 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border/50 bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10'
              }`}>
                {/* Card Header con gradient */}
                <div className="relative h-2 bg-gradient-to-r from-primary via-accent to-primary/50" />
                
                {/* Card Content */}
                <div className="p-6 space-y-4">
                  {/* Title y acciones */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold truncate transition-colors text-foreground group-hover:text-primary">
                        {project.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {project.description || "Sin descripción"}
                      </p>
                    </div>
                    
                    {/* Menú de acciones */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-1 transition-opacity opacity-0 group-hover:opacity-100"
                          onClick={(e) => e.preventDefault()}
                          disabled={isLoading}
                        >
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={(e) => {
                          e.preventDefault();
                          onToggleFavorite(project.id);
                        }}>
                          <Star className={`w-4 h-4 mr-2 ${project.is_favorite ? 'fill-current text-yellow-500' : ''}`} />
                          {project.is_favorite ? 'Quitar de favoritos' : 'Marcar como favorito'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={(e) => {
                          e.preventDefault();
                          onDuplicate(project.id);
                        }}>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicar proyecto
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.preventDefault();
                            onDelete(project.id);
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar proyecto
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {project.total_cost !== null && (
                      <div className="p-3 border rounded-lg bg-muted/50 border-border/50">
                        <p className="text-xs font-medium text-muted-foreground">
                          Costo Total
                        </p>
                        <p className="mt-1 text-sm font-semibold text-foreground">
                          ${project.total_cost?.toFixed(2)}
                        </p>
                      </div>
                    )}
                    {project.profit !== null && (
                      <div className={`rounded-lg p-3 border ${
                        project.profit >= 0
                          ? "bg-success/10 border-success/30"
                          : "bg-destructive/10 border-destructive/30"
                      }`}>
                        <p className="text-xs font-medium text-muted-foreground">
                          Ganancia
                        </p>
                        <p className={`mt-1 text-sm font-semibold ${
                          project.profit >= 0 ? "text-success" : "text-destructive"
                        }`}>
                          ${project.profit?.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                    <span>{formatDate(project.created_at)}</span>
                    {project.selling_price !== null && (
                      <span className="font-medium">
                        ${project.selling_price?.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}