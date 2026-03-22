import { Box, Typography } from '@mui/material';
import { format } from 'date-fns';
import { TenantDetail } from '../types/tenant.types';

interface TenantActivityTabProps {
  tenant: TenantDetail;
}

export default function TenantActivityTab({ tenant }: TenantActivityTabProps) {
  const entries = tenant.activityLog.slice(0, 20);

  return (
    <Box sx={{ pt: 2, position: 'relative' }}>
      <Box sx={{ borderLeft: '2px solid', borderColor: 'divider', ml: 1.5, pl: 3 }}>
        {entries.map((entry) => (
          <Box key={entry.id} sx={{ mb: 3, position: 'relative' }}>
            <Box
              sx={{
                position: 'absolute',
                left: -19,
                top: 4,
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                border: '2px solid white',
                boxShadow: '0 0 0 2px #1565C0',
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {format(new Date(entry.timestamp), 'MMM d, yyyy • h:mm a')}
            </Typography>
            <Typography variant="body2" fontWeight={600}>{entry.action}</Typography>
            <Typography variant="caption" color="text.secondary">by {entry.performedBy}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
