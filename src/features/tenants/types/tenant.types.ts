export type TenantStatus = 'active' | 'inactive' | 'overdue' | 'pending' | 'expiring';
export type PaymentStatus = 'paid' | 'overdue' | 'pending' | 'partial';

export interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationalId?: string;
  avatarUrl?: string;
  leaseStatus: TenantStatus;
  paymentStatus: PaymentStatus;
  propertyId: string;
  propertyName: string;
  unitId: string;
  unitName: string;
  leaseStartDate: string;
  leaseEndDate: string;
  monthlyRent: number;
  createdAt: string;
  updatedAt: string;
}

export interface TenantDetail extends Tenant {
  emergencyContact?: { name: string; phone: string; relationship: string };
  notes?: string;
  leaseHistory: LeaseRecord[];
  paymentHistory: PaymentRecord[];
  activityLog: ActivityEntry[];
}

export interface LeaseRecord {
  id: string;
  propertyName: string;
  unitName: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  status: 'active' | 'expired' | 'terminated';
}

export interface PaymentRecord {
  id: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: PaymentStatus;
  method?: string;
}

export interface ActivityEntry {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
}

export interface TenantFilters {
  search: string;
  propertyIds: string[];
  leaseStatus: TenantStatus | '';
  paymentStatus: PaymentStatus | '';
}
