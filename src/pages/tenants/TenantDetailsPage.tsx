import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Button, Alert, Tabs, Tab, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTenant } from '../../features/tenants/hooks/useTenant';
import TenantProfileHeader from '../../features/tenants/components/TenantProfileHeader';
import TenantStatCards from '../../features/tenants/components/TenantStatCards';
import TenantOverviewTab from '../../features/tenants/components/TenantOverviewTab';
import TenantLeaseTab from '../../features/tenants/components/TenantLeaseTab';
import TenantPaymentsTab from '../../features/tenants/components/TenantPaymentsTab';
import TenantActivityTab from '../../features/tenants/components/TenantActivityTab';
import LoadingSkeleton from '../../shared/components/LoadingSkeleton';

export default function TenantDetailsPage() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: tenant, isLoading, isError, refetch } = useTenant(id);
  const [activeTab, setActiveTab] = useState(0);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [reminderMessage, setReminderMessage] = useState('');

  if (isLoading) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/tenants')} sx={{ mb: 2 }}>
          Back to Tenants
        </Button>
        <LoadingSkeleton variant="detail" />
      </Box>
    );
  }

  if (isError || !tenant) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/tenants')} sx={{ mb: 2 }}>
          Back to Tenants
        </Button>
        <Alert
          severity="error"
          action={<Button color="inherit" onClick={() => refetch()}>Retry</Button>}
        >
          Failed to load tenant details.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/tenants')} sx={{ mb: 2 }}>
        Back to Tenants
      </Button>

      <Box sx={{ mb: 2 }}>
        <TenantProfileHeader tenant={tenant} onSendReminder={() => {
          setReminderMessage(`Dear ${tenant.firstName},\n\nThis is a reminder regarding your tenancy at ${tenant.propertyName}, Unit ${tenant.unitName}.\n\nPlease ensure your rent payment is up to date.\n\nBest regards,\nZoneer Management`);
          setReminderOpen(true);
        }} />
      </Box>

      <Box sx={{ mb: 2 }}>
        <TenantStatCards tenant={tenant} />
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 0 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label="Overview" />
          <Tab label="Lease" />
          <Tab label="Payments" />
          <Tab label="Activity" />
        </Tabs>
      </Box>

      {activeTab === 0 && <TenantOverviewTab tenant={tenant} />}
      {activeTab === 1 && <TenantLeaseTab tenant={tenant} />}
      {activeTab === 2 && <TenantPaymentsTab tenant={tenant} />}
      {activeTab === 3 && <TenantActivityTab tenant={tenant} />}

      <Dialog open={reminderOpen} onClose={() => setReminderOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Reminder to {tenant.firstName} {tenant.lastName}</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            rows={6}
            fullWidth
            value={reminderMessage}
            onChange={(e) => setReminderMessage(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReminderOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setReminderOpen(false)}>Send</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
