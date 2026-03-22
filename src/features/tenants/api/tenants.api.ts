import { GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { TenantDetail, TenantFilters } from '../types/tenant.types';
import { MOCK_TENANTS } from '../mock/tenants.mock';

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function randomDelay() {
  return delay(400 + Math.random() * 400);
}

export interface FetchTenantsParams {
  filters: TenantFilters;
  paginationModel: GridPaginationModel;
  sortModel: GridSortModel;
}

export interface FetchTenantsResult {
  rows: TenantDetail[];
  totalCount: number;
}

export async function fetchTenants({ filters, paginationModel, sortModel }: FetchTenantsParams): Promise<FetchTenantsResult> {
  await randomDelay();

  let data = [...MOCK_TENANTS];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    data = data.filter(
      (t) =>
        t.firstName.toLowerCase().includes(q) ||
        t.lastName.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.propertyName.toLowerCase().includes(q) ||
        t.unitName.toLowerCase().includes(q),
    );
  }

  if (filters.propertyIds.length > 0) {
    data = data.filter((t) => filters.propertyIds.includes(t.propertyId));
  }

  if (filters.leaseStatus) {
    data = data.filter((t) => t.leaseStatus === filters.leaseStatus);
  }

  if (filters.paymentStatus) {
    data = data.filter((t) => t.paymentStatus === filters.paymentStatus);
  }

  if (sortModel.length > 0) {
    const { field, sort } = sortModel[0];
    data.sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[field];
      const bVal = (b as Record<string, unknown>)[field];
      if (aVal == null || bVal == null) return 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sort === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sort === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }

  const totalCount = data.length;
  const { page, pageSize } = paginationModel;
  const rows = data.slice(page * pageSize, (page + 1) * pageSize);

  return { rows, totalCount };
}

export async function fetchTenantById(id: string): Promise<TenantDetail> {
  await randomDelay();
  const tenant = MOCK_TENANTS.find((t) => t.id === id);
  if (!tenant) throw new Error(`Tenant ${id} not found`);
  return { ...tenant };
}

export async function createTenant(data: Partial<TenantDetail>): Promise<TenantDetail> {
  await randomDelay();
  const newTenant: TenantDetail = {
    id: `t${Date.now()}`,
    firstName: data.firstName ?? '',
    lastName: data.lastName ?? '',
    email: data.email ?? '',
    phone: data.phone ?? '',
    nationalId: data.nationalId,
    leaseStatus: data.leaseStatus ?? 'pending',
    paymentStatus: data.paymentStatus ?? 'pending',
    propertyId: data.propertyId ?? '',
    propertyName: data.propertyName ?? '',
    unitId: data.unitId ?? '',
    unitName: data.unitName ?? '',
    leaseStartDate: data.leaseStartDate ?? new Date().toISOString(),
    leaseEndDate: data.leaseEndDate ?? new Date().toISOString(),
    monthlyRent: data.monthlyRent ?? 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: data.notes,
    emergencyContact: data.emergencyContact,
    leaseHistory: [],
    paymentHistory: [],
    activityLog: [
      {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'Tenant profile created',
        performedBy: 'System',
      },
    ],
  };
  MOCK_TENANTS.push(newTenant);
  return newTenant;
}

export async function updateTenant(id: string, data: Partial<TenantDetail>): Promise<TenantDetail> {
  await randomDelay();
  const idx = MOCK_TENANTS.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error(`Tenant ${id} not found`);
  MOCK_TENANTS[idx] = { ...MOCK_TENANTS[idx], ...data, updatedAt: new Date().toISOString() };
  return { ...MOCK_TENANTS[idx] };
}

export async function deleteTenant(id: string): Promise<void> {
  await randomDelay();
  const idx = MOCK_TENANTS.findIndex((t) => t.id === id);
  if (idx !== -1) MOCK_TENANTS.splice(idx, 1);
}
