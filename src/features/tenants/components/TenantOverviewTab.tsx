import { Grid, Card, CardContent, Typography, Box, Divider } from '@mui/material';
import { TenantDetail } from '../types/tenant.types';

interface InfoRowProps {
  label: string;
  value?: string;
}
function InfoRow({ label, value }: InfoRowProps) {
  return (
    <Box sx={{ display: 'flex', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Typography variant="body2" color="text.secondary" sx={{ width: 140, flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography variant="body2">{value || '—'}</Typography>
    </Box>
  );
}

interface TenantOverviewTabProps {
  tenant: TenantDetail;
}

export default function TenantOverviewTab({ tenant }: TenantOverviewTabProps) {
  return (
    <Box sx={{ pt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card elevation={0}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Personal Information</Typography>
              <Divider sx={{ mb: 1 }} />
              <InfoRow label="Full Name" value={`${tenant.firstName} ${tenant.lastName}`} />
              <InfoRow label="Email" value={tenant.email} />
              <InfoRow label="Phone" value={tenant.phone} />
              <InfoRow label="National ID" value={tenant.nationalId} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={0}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Emergency Contact</Typography>
              <Divider sx={{ mb: 1 }} />
              {tenant.emergencyContact ? (
                <>
                  <InfoRow label="Name" value={tenant.emergencyContact.name} />
                  <InfoRow label="Phone" value={tenant.emergencyContact.phone} />
                  <InfoRow label="Relationship" value={tenant.emergencyContact.relationship} />
                </>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  No emergency contact on file
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Card elevation={0} sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Notes</Typography>
          <Divider sx={{ mb: 1 }} />
          <Typography variant="body2" color={tenant.notes ? 'text.primary' : 'text.secondary'}>
            {tenant.notes || 'No notes added'}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
