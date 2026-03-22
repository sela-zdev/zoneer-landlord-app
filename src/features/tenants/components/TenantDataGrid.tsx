import { Avatar, Box, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel, GridSortModel, GridRowParams, GridRenderCellParams } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { TenantDetail } from '../types/tenant.types';
import TenantStatusChip from './TenantStatusChip';
import TenantRowActions from './TenantRowActions';
import EmptyState from './EmptyState';

interface TenantDataGridProps {
  rows: TenantDetail[];
  totalCount: number;
  loading: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (m: GridPaginationModel) => void;
  sortModel: GridSortModel;
  onSortModelChange: (m: GridSortModel) => void;
  onRowClick: (params: GridRowParams) => void;
}

export default function TenantDataGrid({
  rows,
  totalCount,
  loading,
  paginationModel,
  onPaginationModelChange,
  sortModel,
  onSortModelChange,
  onRowClick,
}: TenantDataGridProps) {
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Tenant',
      flex: 1.5,
      minWidth: 200,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as TenantDetail;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.5 }}>
            <Avatar sx={{ width: 32, height: 32, fontSize: 13, bgcolor: 'primary.main' }}>
              {row.firstName[0]}{row.lastName[0]}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600}>
                {row.firstName} {row.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {row.email}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: 'propertyName',
      headerName: 'Property',
      flex: 1,
      minWidth: 140,
    },
    {
      field: 'unitName',
      headerName: 'Unit',
      width: 80,
    },
    {
      field: 'leaseStatus',
      headerName: 'Lease Status',
      width: 130,
      renderCell: (params: GridRenderCellParams) => <TenantStatusChip status={params.value as string} />,
    },
    {
      field: 'paymentStatus',
      headerName: 'Payment',
      width: 120,
      renderCell: (params: GridRenderCellParams) => <TenantStatusChip status={params.value as string} />,
    },
    {
      field: 'leaseEndDate',
      headerName: 'Lease End',
      width: 120,
      renderCell: (params: GridRenderCellParams) => {
        try {
          return format(new Date(params.value as string), 'MMM d, yyyy');
        } catch {
          return params.value as string;
        }
      },
    },
    {
      field: 'actions',
      headerName: '',
      width: 60,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as TenantDetail;
        return <TenantRowActions tenantId={row.id} />;
      },
    },
  ];

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      rowCount={totalCount}
      loading={loading}
      paginationMode="server"
      sortingMode="server"
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      sortModel={sortModel}
      onSortModelChange={onSortModelChange}
      pageSizeOptions={[25, 50, 100]}
      checkboxSelection
      disableRowSelectionOnClick
      onRowClick={onRowClick}
      slots={{ noRowsOverlay: EmptyState }}
      sx={{
        border: 'none',
        '& .MuiDataGrid-columnHeaders': {
          bgcolor: 'grey.50',
          '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 600 },
        },
        '& .MuiDataGrid-row': {
          cursor: 'pointer',
          '&:hover': { bgcolor: 'action.hover' },
        },
        '& .MuiDataGrid-cell': { borderColor: 'divider' },
      }}
    />
  );
}
