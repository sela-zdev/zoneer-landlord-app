import {
  Box, Paper, Typography, Grid, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow
} from '@mui/material';
import { format } from 'date-fns';
import { TenantDetail } from '../types/tenant.types';
import TenantStatusChip from './TenantStatusChip';

interface TenantPaymentsTabProps {
  tenant: TenantDetail;
}

export default function TenantPaymentsTab({ tenant }: TenantPaymentsTabProps) {
  const totalPaid = tenant.paymentHistory
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalDue = tenant.paymentHistory.reduce((sum, p) => sum + p.amount, 0);
  const outstanding = totalDue - totalPaid;

  const fmtDate = (d?: string) => {
    if (!d) return '—';
    try { return format(new Date(d), 'MMM d, yyyy'); } catch { return d; }
  };

  return (
    <Box sx={{ pt: 2 }}>
      <Paper elevation={0} sx={{ border: '1px solid #E0E4EF', p: 2.5, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">Total Paid</Typography>
            <Typography variant="h6" color="success.main">${totalPaid.toLocaleString()}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">Total Due</Typography>
            <Typography variant="h6">${totalDue.toLocaleString()}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">Outstanding Balance</Typography>
            <Typography variant="h6" color={outstanding > 0 ? 'error.main' : 'success.main'}>
              ${outstanding.toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E0E4EF' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Month</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Paid Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Method</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenant.paymentHistory.map((p) => (
              <TableRow
                key={p.id}
                sx={{ bgcolor: p.status === 'overdue' ? 'error.50' : 'inherit' }}
              >
                <TableCell>{fmtDate(p.dueDate).slice(0, 8)}</TableCell>
                <TableCell>${p.amount.toLocaleString()}</TableCell>
                <TableCell>{fmtDate(p.dueDate)}</TableCell>
                <TableCell>{fmtDate(p.paidDate)}</TableCell>
                <TableCell><TenantStatusChip status={p.status} /></TableCell>
                <TableCell>{p.method || '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
