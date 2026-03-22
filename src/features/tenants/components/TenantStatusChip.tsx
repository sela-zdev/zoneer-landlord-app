import { Chip } from '@mui/material';
import { TenantStatus, PaymentStatus } from '../types/tenant.types';

interface TenantStatusChipProps {
  status: TenantStatus | PaymentStatus;
}

type ChipColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

function getColor(status: TenantStatus | PaymentStatus): ChipColor {
  switch (status) {
    case 'active': return 'success';
    case 'inactive': return 'default';
    case 'overdue': return 'error';
    case 'pending': return 'warning';
    case 'expiring': return 'info';
    case 'paid': return 'success';
    case 'partial': return 'warning';
    default: return 'default';
  }
}

export default function TenantStatusChip({ status }: TenantStatusChipProps) {
  return (
    <Chip
      label={status.charAt(0).toUpperCase() + status.slice(1)}
      color={getColor(status)}
      size="small"
      variant="filled"
    />
  );
}
