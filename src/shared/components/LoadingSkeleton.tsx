import { Box, Skeleton, Grid } from '@mui/material';

interface LoadingSkeletonProps {
  variant: 'list' | 'detail' | 'form';
}

export default function LoadingSkeleton({ variant }: LoadingSkeletonProps) {
  if (variant === 'list') {
    return (
      <Box>
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={52} sx={{ mb: 1, borderRadius: 1 }} />
        ))}
      </Box>
    );
  }

  if (variant === 'detail') {
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Skeleton variant="circular" width={80} height={80} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="40%" height={36} />
            <Skeleton variant="text" width="30%" height={24} />
            <Skeleton variant="text" width="20%" height={24} />
          </Box>
        </Box>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} md={4} key={i}>
              <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
        <Skeleton variant="rectangular" height={48} sx={{ mb: 2, borderRadius: 1 }} />
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  return (
    <Box>
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} variant="rectangular" height={56} sx={{ mb: 2, borderRadius: 1 }} />
      ))}
    </Box>
  );
}
