import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { TenantFilters } from '../types/tenant.types';
import { fetchTenants } from '../api/tenants.api';

const DEFAULT_FILTERS: TenantFilters = {
  search: '',
  propertyIds: [],
  leaseStatus: '',
  paymentStatus: '',
};

export function useTenants() {
  const [filters, setFiltersState] = useState<TenantFilters>(DEFAULT_FILTERS);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  const setFilters = useCallback((update: Partial<TenantFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...update }));
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, []);

  const query = useQuery({
    queryKey: ['tenants', filters, paginationModel, sortModel],
    queryFn: () => fetchTenants({ filters, paginationModel, sortModel }),
  });

  return { filters, setFilters, paginationModel, setPaginationModel, sortModel, setSortModel, ...query };
}
