import { Box, Typography, Button } from '@mui/material';
import HomeWorkIcon from '@mui/icons-material/HomeWork';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title = 'No tenants found',
  subtitle = 'Try adjusting your filters or add a new tenant.',
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, gap: 1 }}>
      <HomeWorkIcon sx={{ fontSize: 96, color: 'text.disabled', mb: 1 }} />
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        {subtitle}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction} sx={{ mt: 2 }}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
