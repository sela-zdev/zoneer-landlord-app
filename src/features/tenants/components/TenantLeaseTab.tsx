import {
  Box, Card, CardContent, Typography, Chip, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { format } from 'date-fns';
import { TenantDetail } from '../types/tenant.types';
import TenantStatusChip from './TenantStatusChip';

interface TenantLeaseTabProps {
  tenant: TenantDetail;
}

export default function TenantLeaseTab({ tenant }: TenantLeaseTabProps) {
  return (
    <Box sx={{ pt: 2 }}>
      <Card elevation={0} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Current Lease</Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">Property</Typography>
              <Typography variant="body2" fontWeight={600}>{tenant.propertyName}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Unit</Typography>
              <Typography variant="body2" fontWeight={600}>{tenant.unitName}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Lease Period</Typography>
              <Typography variant="body2" fontWeight={600}>
                {format(new Date(tenant.leaseStartDate), 'MMM d, yyyy')} –{' '}
                {format(new Date(tenant.leaseEndDate), 'MMM d, yyyy')}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Monthly Rent</Typography>
              <Typography variant="body2" fontWeight={600}>
                ${tenant.monthlyRent.toLocaleString()}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Status</Typography>
              <Box sx={{ mt: 0.5 }}>
                <TenantStatusChip status={tenant.leaseStatus} />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>Lease History</Typography>
      {tenant.leaseHistory.length === 0 ? (
        <Typography variant="body2" color="text.secondary">No previous leases</Typography>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E0E4EF' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Property</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Unit</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Period</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Rent/mo</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tenant.leaseHistory.map((lease) => (
                <TableRow key={lease.id}>
                  <TableCell>{lease.propertyName}</TableCell>
                  <TableCell>{lease.unitName}</TableCell>
                  <TableCell>
                    {format(new Date(lease.startDate), 'MMM yyyy')} –{' '}
                    {format(new Date(lease.endDate), 'MMM yyyy')}
                  </TableCell>
                  <TableCell>${lease.monthlyRent.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip label={lease.status} size="small" color={lease.status === 'active' ? 'success' : lease.status === 'terminated' ? 'error' : 'default'} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
