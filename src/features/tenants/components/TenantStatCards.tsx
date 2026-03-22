import { Grid, Card, CardContent, Typography } from '@mui/material';
import { format, differenceInDays, parseISO, isAfter } from 'date-fns';
import { TenantDetail } from '../types/tenant.types';

interface TenantStatCardsProps {
  tenant: TenantDetail;
}

export default function TenantStatCards({ tenant }: TenantStatCardsProps) {
  const leaseEnd = parseISO(tenant.leaseEndDate);
  const leaseStart = parseISO(tenant.leaseStartDate);
  const today = new Date();
  const isExpired = !isAfter(leaseEnd, today);
  const daysToExpiry = differenceInDays(leaseEnd, today);
  const daysTenanted = differenceInDays(today, leaseStart);

  const balance = tenant.paymentHistory
    .filter((p) => p.status === 'overdue' || p.status === 'pending' || p.status === 'partial')
    .reduce((sum, p) => sum + p.amount, 0);

  const leaseEndColor = isExpired ? 'error.main' : daysToExpiry <= 30 ? 'warning.main' : 'text.primary';

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Card elevation={0}>
          <CardContent>
            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
              Lease End Date
            </Typography>
            <Typography variant="h6" sx={{ color: leaseEndColor, mt: 0.5 }}>
              {format(leaseEnd, 'MMM d, yyyy')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isExpired ? 'Expired' : `${daysToExpiry} days remaining`}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card elevation={0}>
          <CardContent>
            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
              Balance Due
            </Typography>
            <Typography variant="h6" sx={{ color: balance > 0 ? 'error.main' : 'success.main', mt: 0.5 }}>
              ${balance.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {balance > 0 ? 'Outstanding' : 'No balance due'}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card elevation={0}>
          <CardContent>
            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
              Days Tenanted
            </Typography>
            <Typography variant="h6" sx={{ mt: 0.5 }}>
              {daysTenanted.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Since {format(leaseStart, 'MMM d, yyyy')}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
