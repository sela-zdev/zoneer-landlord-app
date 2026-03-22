import { Box, Typography, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { GridRowParams } from '@mui/x-data-grid';
import { useTenants } from '../../features/tenants/hooks/useTenants';
import TenantFilterBar from '../../features/tenants/components/TenantFilterBar';
import TenantDataGrid from '../../features/tenants/components/TenantDataGrid';

export default function TenantListPage() {
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    filters,
    setFilters,
    paginationModel,
    setPaginationModel,
    sortModel,
    setSortModel,
  } = useTenants();

  const rows = data?.rows ?? [];
  const totalCount = data?.totalCount ?? 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="h5">Tenants</Typography>
          <Typography variant="body2" color="text.secondary">
            {totalCount} tenant{totalCount !== 1 ? 's' : ''}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/tenants/new')}
        >
          Add Tenant
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <TenantFilterBar filters={filters} onFiltersChange={setFilters} />
      </Box>

      <Paper elevation={0} sx={{ border: '1px solid #E0E4EF', height: 'calc(100vh - 280px)', minHeight: 400 }}>
        <TenantDataGrid
          rows={rows}
          totalCount={totalCount}
          loading={isLoading}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          onRowClick={(params: GridRowParams) => navigate(`/tenants/${params.id}`)}
        />
      </Paper>
    </Box>
  );
}
