'use client';

import { Search, Grid3x3, List, Filter, ArrowDownWideNarrow } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ViewType, FilterType, SortType } from './types';

interface ProjectsHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  viewType: ViewType;
  onViewTypeChange: (view: ViewType) => void;
  filterType: FilterType;
  onFilterTypeChange: (filter: FilterType) => void;
  sortType: SortType;
  onSortTypeChange: (sort: SortType) => void;
  totalProjects: number;
  isLoading: boolean;
}

export function ProjectsHeader({
  searchTerm,
  onSearchChange,
  viewType,
  onViewTypeChange,
  filterType,
  onFilterTypeChange,
  sortType,
  onSortTypeChange,
  totalProjects,
  isLoading
}: ProjectsHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Búsqueda principal */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar proyectos por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
            disabled={isLoading}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {totalProjects} proyecto{totalProjects !== 1 ? 's' : ''}
          </span>
          
          <ToggleGroup 
            type="single" 
            value={viewType} 
            onValueChange={(value) => value && onViewTypeChange(value as ViewType)}
            className="hidden sm:flex"
            disabled={isLoading}
          >
            <ToggleGroupItem value="grid" aria-label="Vista de cuadrícula">
              <Grid3x3 className="w-4 h-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="table" aria-label="Vista de tabla">
              <List className="w-4 h-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {/* Filtros y ordenamiento */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={filterType} onValueChange={(value) => onFilterTypeChange(value as FilterType)} disabled={isLoading}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los proyectos</SelectItem>
              <SelectItem value="profitable">Solo rentables</SelectItem>
              <SelectItem value="unprofitable">No rentables</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <ArrowDownWideNarrow className="w-4 h-4 text-muted-foreground" />
          <Select value={sortType} onValueChange={(value) => onSortTypeChange(value as SortType)} disabled={isLoading}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Más recientes</SelectItem>
              <SelectItem value="oldest">Más antiguos</SelectItem>
              <SelectItem value="most-profitable">Más rentables</SelectItem>
              <SelectItem value="least-profitable">Menos rentables</SelectItem>
              <SelectItem value="highest-cost">Mayor costo</SelectItem>
              <SelectItem value="lowest-cost">Menor costo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}