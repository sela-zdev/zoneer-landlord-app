import { useQuery } from '@tanstack/react-query';
import { fetchTenantById } from '../api/tenants.api';

export function useTenant(id: string) {
  return useQuery({
    queryKey: ['tenant', id],
    queryFn: () => fetchTenantById(id),
    enabled: !!id,
  });
}
