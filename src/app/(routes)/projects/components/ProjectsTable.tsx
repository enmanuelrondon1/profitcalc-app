// src/app/(routes)/projects/components/ProjectsTable.tsx
'use client';

import Link from 'next/link';
import { Database } from '@/lib/supabase/database.types';
import { 
  Calendar, 
  Copy, 
  Trash2, 
  Star,
  MoreVertical,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDate } from './utils';

type Project = Database['public']['Tables']['projects']['Row'];

interface ProjectsTableProps {
  projects: Project[];
  onDuplicate: (projectId: string) => void;
  onDelete: (projectId: string) => void;
  onToggleFavorite: (projectId: string) => void;
  selectedProjects: Set<string>;
  onSelectionChange: (selected: Set<string>) => void;
  onDeleteMultiple: (projectIds: string[]) => void;
  isLoading: boolean;
}

export function ProjectsTable({
  projects,
  onDuplicate,
  onDelete,
  onToggleFavorite,
  selectedProjects,
  onSelectionChange,
  onDeleteMultiple,
  isLoading
}: ProjectsTableProps) {
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

  const getProfitabilityBadge = (profit: number | null, totalCost: number | null) => {
    if (profit === null || totalCost === null || totalCost === 0) return null;
    
    const percentage = (profit / totalCost) * 100;
    
    if (percentage > 50) {
      return <Badge variant="default" className="text-xs text-white bg-green-500">Excelente</Badge>;
    } else if (percentage > 20) {
      return <Badge variant="default" className="text-xs">Buena</Badge>;
    } else if (percentage > 0) {
      return <Badge variant="secondary" className="text-xs">Baja</Badge>;
    } else {
      return <Badge variant="destructive" className="text-xs">Pérdida</Badge>;
    }
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

      {/* Tabla de proyectos */}
      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSelectAll}
                  className="w-8 h-8 p-1"
                  disabled={isLoading}
                >
                  {selectedProjects.size === projects.length ? (
                    <CheckSquare className="w-4 h-4" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead className="w-12">Fav</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="text-right">Costo Total</TableHead>
              <TableHead className="text-right">Ganancia</TableHead>
              <TableHead className="text-center">Rentabilidad</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id} className="group">
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleProjectSelection(project.id)}
                    className="w-8 h-8 p-1"
                    disabled={isLoading}
                  >
                    {selectedProjects.has(project.id) ? (
                      <CheckSquare className="w-4 h-4 text-primary" />
                    ) : (
                      <Square className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-8 h-8 p-1 transition-colors ${
                      project.is_favorite 
                        ? 'text-yellow-500 hover:text-yellow-600' 
                        : 'text-muted-foreground hover:text-yellow-500'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      onToggleFavorite(project.id);
                    }}
                    disabled={isLoading}
                  >
                    <Star className={`w-4 h-4 ${project.is_favorite ? 'fill-current' : ''}`} />
                  </Button>
                </TableCell>
                <TableCell>
                  <Link href={`/projects/${project.id}`} className="font-medium transition-colors hover:text-primary">
                    {project.name}
                  </Link>
                </TableCell>
                <TableCell className="max-w-xs">
                  <span className="text-sm text-muted-foreground line-clamp-2">
                    {project.description || "Sin descripción"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-medium">
                    ${project.total_cost?.toFixed(2) || '0.00'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className={`font-medium ${
                    project.profit !== null && project.profit >= 0 
                      ? 'text-green-600'
                      : 'text-destructive'
                  }`}>
                    ${project.profit?.toFixed(2) || '0.00'}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  {getProfitabilityBadge(project.profit, project.total_cost)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {formatDate(project.created_at)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-1"
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}