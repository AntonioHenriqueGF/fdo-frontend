import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { ApiRequest, type StandardApiResponse } from '../../../../Services/ApiRequest';
import type { Category } from '../../../Categories/models/Categories';
import type { DashboardCategoryFilters } from '../../models/GraphModels';

import { DashboardCategoryFiltersForm } from '../DashboardCategoryFiltersForm';
import { CategoryTotalsPieChart } from '../CategoryTotalsPieChart';
import { DailyGraph } from '../DailyGraph';
import { DailyCategoryPanelWrapper } from './styles';
import { format } from 'date-fns';

const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

export const DailyCategoryPanel: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [filters, setFilters] = useState<DashboardCategoryFilters>({
    category_id: [],
    date_start: formatDate(new Date(new Date().setDate(new Date().getDate() - 30))),
    date_end: formatDate(new Date()),
  });

  useEffect(() => {
    const abort = new AbortController();

    setLoadingCategories(true);
    ApiRequest<StandardApiResponse<Category[]>>({
      url: '/api/categories',
      method: 'GET',
      signal: abort.signal,
      callback: (response) => {
        setCategories(response.data.data);
      },
      errorCallback: () => {
        if (abort.signal.aborted) return;
        enqueueSnackbar('Error loading categories', { variant: 'error' });
      },
      finallyCallback: () => {
        if (abort.signal.aborted) return;
        setLoadingCategories(false);
      },
    });

    return () => {
      abort.abort();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFiltersSubmit = (nextFilters: DashboardCategoryFilters) => {
    setFilters(nextFilters);
  };

  return (
    <div>
      <DashboardCategoryFiltersForm
        categories={categories}
        loadingCategories={loadingCategories}
        initialFilters={filters}
        onSubmit={handleFiltersSubmit}
      />
      <DailyCategoryPanelWrapper>
        <DailyGraph filters={filters} />
        <CategoryTotalsPieChart filters={filters} />
      </DailyCategoryPanelWrapper>
    </div>
  );
};