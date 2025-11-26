//src/lib/types.ts
export type ViewType = 'grid' | 'table';
export type FilterType = 'all' | 'profitable' | 'unprofitable';
export type SortType = 
  | 'newest' 
  | 'oldest' 
  | 'most-profitable' 
  | 'least-profitable' 
  | 'highest-cost' 
  | 'lowest-cost';

export interface ProjectStats {
  totalProjects: number;
  profitableProjects: number;
  unprofitableProjects: number;
  totalRevenue: number;
  avgProfitability: number;
}