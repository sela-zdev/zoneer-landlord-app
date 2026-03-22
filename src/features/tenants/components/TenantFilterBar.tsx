import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Autocomplete,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { TenantFilters, TenantStatus, PaymentStatus } from '../types/tenant.types';
import { PROPERTIES } from '../mock/tenants.mock';

interface TenantFilterBarProps {
  filters: TenantFilters;
  onFiltersChange: (update: Partial<TenantFilters>) => void;
}

const LEASE_STATUSES: Array<TenantStatus | ''> = ['', 'active', 'overdue', 'pending', 'expiring'];
const PAYMENT_STATUSES: Array<{ value: PaymentStatus | ''; label: string }> = [
  { value: '', label: 'All' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'pending', label: 'Pending' },
  { value: 'partial', label: 'Partial' },
];

export default function TenantFilterBar({ filters, onFiltersChange }: TenantFilterBarProps) {
  const [searchInput, setSearchInput] = useState(filters.search);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFiltersChange({ search: searchInput });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, filters.search, onFiltersChange]);

  const hasActiveFilters =
    filters.search !== '' ||
    filters.propertyIds.length > 0 ||
    filters.leaseStatus !== '' ||
    filters.paymentStatus !== '';

  const handleClear = useCallback(() => {
    setSearchInput('');
    onFiltersChange({ search: '', propertyIds: [], leaseStatus: '', paymentStatus: '' });
  }, [onFiltersChange]);

  const selectedProperties = PROPERTIES.filter((p) => filters.propertyIds.includes(p.id));

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={1.5}
      alignItems={{ xs: 'stretch', md: 'center' }}
      flexWrap="wrap"
      useFlexGap
    >
      <TextField
        size="small"
        placeholder="Search tenants..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
        sx={{ minWidth: 220 }}
      />

      <ToggleButtonGroup
        size="small"
        value={filters.leaseStatus}
        exclusive
        onChange={(_: React.MouseEvent<HTMLElement>, val: TenantStatus | '' | null) => {
          onFiltersChange({ leaseStatus: val ?? '' });
        }}
      >
        {LEASE_STATUSES.map((s) => (
          <ToggleButton key={s === '' ? 'all' : s} value={s} sx={{ textTransform: 'capitalize', px: 1.5 }}>
            {s === '' ? 'All' : s}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Autocomplete
        multiple
        size="small"
        options={PROPERTIES}
        getOptionLabel={(o) => o.name}
        value={selectedProperties}
        onChange={(_, val) => onFiltersChange({ propertyIds: val.map((v) => v.id) })}
        renderInput={(params) => <TextField {...params} placeholder="Property" />}
        sx={{ minWidth: 200 }}
        disableCloseOnSelect
      />

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Payment</InputLabel>
        <Select
          value={filters.paymentStatus}
          label="Payment"
          onChange={(e) => onFiltersChange({ paymentStatus: e.target.value as PaymentStatus | '' })}
        >
          {PAYMENT_STATUSES.map((s) => (
            <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {hasActiveFilters && (
        <Button variant="text" size="small" onClick={handleClear} color="inherit">
          Clear All
        </Button>
      )}
    </Stack>
  );
}
