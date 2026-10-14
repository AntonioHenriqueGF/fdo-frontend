import { atom } from 'jotai';
import type { DashboardFilters } from '../models/GraphModels';
import { buildDefaultFilters } from '../utils/period';

// Kept in memory so the selected mode/period survives navigating between dashboard pages
export const DashboardFiltersAtom = atom<DashboardFilters>(
  buildDefaultFilters('monthly'),
);
