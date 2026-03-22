import React, { useState, useEffect } from 'react';
import {
  Box, Button, Stepper, Step, StepLabel, Grid, TextField, Typography,
  Autocomplete, Select, MenuItem, FormControl, InputLabel, CircularProgress,
  Card, CardContent, Divider, Accordion, AccordionSummary, AccordionDetails,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Snackbar, Alert, Paper,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams, useBlocker } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { PROPERTIES } from '../../features/tenants/mock/tenants.mock';
import { createTenant, updateTenant } from '../../features/tenants/api/tenants.api';
import { useTenant } from '../../features/tenants/hooks/useTenant';
import LoadingSkeleton from '../../shared/components/LoadingSkeleton';

interface TenantFormPageProps {
  mode: 'add' | 'edit';
}

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationalId?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  emergencyRelationship?: string;
  propertyId: string;
  unitName: string;
  leaseStartDate: Date | null;
  leaseEndDate: Date | null;
  monthlyRent: number;
  notes?: string;
}

const schema = yup.object({
  firstName: yup.string().required('Required').min(2, 'Min 2 chars'),
  lastName: yup.string().required('Required').min(2, 'Min 2 chars'),
  email: yup.string().required('Required').email('Invalid email'),
  phone: yup.string().required('Required').min(7, 'Min 7 chars'),
  nationalId: yup.string().optional(),
  emergencyName: yup.string().optional(),
  emergencyPhone: yup.string().optional(),
  emergencyRelationship: yup.string().optional(),
  propertyId: yup.string().required('Required'),
  unitName: yup.string().required('Required'),
  leaseStartDate: yup.date().nullable().required('Required'),
  leaseEndDate: yup
    .date()
    .nullable()
    .required('Required')
    .when('leaseStartDate', (leaseStartDate, schema) =>
      leaseStartDate && leaseStartDate[0]
        ? schema.min(leaseStartDate[0] as Date, 'Must be after start date')
        : schema,
    ),
  monthlyRent: yup.number().required('Required').positive('Must be > 0').typeError('Must be a number'),
  notes: yup.string().optional(),
});

const ADD_STEPS = ['Personal Info', 'Lease Assignment', 'Review'];
const STEP_FIELDS: Array<Array<keyof FormValues>> = [
  ['firstName', 'lastName', 'email', 'phone'],
  ['propertyId', 'unitName', 'leaseStartDate', 'leaseEndDate', 'monthlyRent'],
  [],
];

export default function TenantFormPage({ mode }: TenantFormPageProps) {
  const navigate = useNavigate();
  const { id = '' } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  const { data: existingTenant, isLoading: tenantLoading } = useTenant(mode === 'edit' ? id : '');

  const {
    control,
    handleSubmit,
    trigger,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      nationalId: '',
      emergencyName: '',
      emergencyPhone: '',
      emergencyRelationship: '',
      propertyId: '',
      unitName: '',
      leaseStartDate: null,
      leaseEndDate: null,
      monthlyRent: 0,
      notes: '',
    },
  });

  useEffect(() => {
    if (mode === 'edit' && existingTenant) {
      reset({
        firstName: existingTenant.firstName,
        lastName: existingTenant.lastName,
        email: existingTenant.email,
        phone: existingTenant.phone,
        nationalId: existingTenant.nationalId ?? '',
        emergencyName: existingTenant.emergencyContact?.name ?? '',
        emergencyPhone: existingTenant.emergencyContact?.phone ?? '',
        emergencyRelationship: existingTenant.emergencyContact?.relationship ?? '',
        propertyId: existingTenant.propertyId,
        unitName: existingTenant.unitName,
        leaseStartDate: new Date(existingTenant.leaseStartDate),
        leaseEndDate: new Date(existingTenant.leaseEndDate),
        monthlyRent: existingTenant.monthlyRent,
        notes: existingTenant.notes ?? '',
      });
    }
  }, [existingTenant, mode, reset]);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && !snackbar.open && currentLocation.pathname !== nextLocation.pathname
  );

  const createMutation = useMutation({
    mutationFn: createTenant,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      setSnackbar({ open: true, message: 'Tenant created successfully', severity: 'success' });
      setTimeout(() => navigate(`/tenants/${data.id}`), 800);
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to create tenant', severity: 'error' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<typeof existingTenant>) => updateTenant(id, data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['tenant', id] });
      setSnackbar({ open: true, message: 'Tenant updated successfully', severity: 'success' });
      setTimeout(() => navigate(`/tenants/${id}`), 800);
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to update tenant', severity: 'error' });
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: FormValues) => {
    const selectedProperty = PROPERTIES.find((p) => p.id === values.propertyId);
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      nationalId: values.nationalId || undefined,
      propertyId: values.propertyId,
      propertyName: selectedProperty?.name ?? '',
      unitId: `u${values.unitName}`,
      unitName: values.unitName,
      leaseStartDate: values.leaseStartDate ? values.leaseStartDate.toISOString() : '',
      leaseEndDate: values.leaseEndDate ? values.leaseEndDate.toISOString() : '',
      monthlyRent: values.monthlyRent,
      notes: values.notes || undefined,
      emergencyContact:
        values.emergencyName
          ? { name: values.emergencyName, phone: values.emergencyPhone ?? '', relationship: values.emergencyRelationship ?? '' }
          : undefined,
    };
    if (mode === 'add') {
      createMutation.mutate(payload);
    } else {
      updateMutation.mutate(payload);
    }
  };

  const handleNext = async () => {
    const valid = await trigger(STEP_FIELDS[step] as any);
    if (valid) setStep((s) => s + 1);
  };

  const watchedValues = watch();
  const selectedProperty = PROPERTIES.find((p) => p.id === watchedValues.propertyId);
  const availableUnits = selectedProperty?.units ?? [];

  if (mode === 'edit' && tenantLoading) {
    return <LoadingSkeleton variant="form" />;
  }

  const personalFields = (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Controller name="firstName" control={control} render={({ field }) => (
          <TextField {...field} label="First Name *" fullWidth error={!!errors.firstName} helperText={errors.firstName?.message} />
        )} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controller name="lastName" control={control} render={({ field }) => (
          <TextField {...field} label="Last Name *" fullWidth error={!!errors.lastName} helperText={errors.lastName?.message} />
        )} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controller name="email" control={control} render={({ field }) => (
          <TextField {...field} label="Email *" fullWidth error={!!errors.email} helperText={errors.email?.message} />
        )} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controller name="phone" control={control} render={({ field }) => (
          <TextField {...field} label="Phone *" fullWidth error={!!errors.phone} helperText={errors.phone?.message} />
        )} />
      </Grid>
      <Grid item xs={12}>
        <Controller name="nationalId" control={control} render={({ field }) => (
          <TextField {...field} label="National ID" fullWidth />
        )} />
      </Grid>
      <Grid item xs={12}>
        <Accordion elevation={0} sx={{ border: '1px solid #E0E4EF' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2">Emergency Contact (Optional)</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller name="emergencyName" control={control} render={({ field }) => (
                  <TextField {...field} label="Contact Name" fullWidth />
                )} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller name="emergencyPhone" control={control} render={({ field }) => (
                  <TextField {...field} label="Phone" fullWidth />
                )} />
              </Grid>
              <Grid item xs={12}>
                <Controller name="emergencyRelationship" control={control} render={({ field }) => (
                  <TextField {...field} label="Relationship" fullWidth />
                )} />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );

  const leaseFields = (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller name="propertyId" control={control} render={({ field }) => (
            <Autocomplete
              options={PROPERTIES}
              getOptionLabel={(o) => o.name}
              value={PROPERTIES.find((p) => p.id === field.value) ?? null}
              onChange={(_, val) => { field.onChange(val?.id ?? ''); }}
              renderInput={(params) => (
                <TextField {...params} label="Property *" error={!!errors.propertyId} helperText={errors.propertyId?.message} />
              )}
            />
          )} />
        </Grid>
        <Grid item xs={12}>
          <Controller name="unitName" control={control} render={({ field }) => (
            <FormControl fullWidth error={!!errors.unitName}>
              <InputLabel>Unit *</InputLabel>
              <Select {...field} label="Unit *">
                {availableUnits.map((u) => (
                  <MenuItem key={u} value={u}>{u}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller name="leaseStartDate" control={control} render={({ field }) => (
            <DatePicker
              label="Lease Start *"
              value={field.value}
              onChange={field.onChange}
              slotProps={{
                textField: { fullWidth: true, error: !!errors.leaseStartDate, helperText: errors.leaseStartDate?.message as string | undefined },
              }}
            />
          )} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller name="leaseEndDate" control={control} render={({ field }) => (
            <DatePicker
              label="Lease End *"
              value={field.value}
              onChange={field.onChange}
              slotProps={{
                textField: { fullWidth: true, error: !!errors.leaseEndDate, helperText: errors.leaseEndDate?.message as string | undefined },
              }}
            />
          )} />
        </Grid>
        <Grid item xs={12}>
          <Controller name="monthlyRent" control={control} render={({ field }) => (
            <TextField
              {...field}
              label="Monthly Rent *"
              type="number"
              fullWidth
              error={!!errors.monthlyRent}
              helperText={errors.monthlyRent?.message}
              onChange={(e) => field.onChange(parseFloat(e.target.value))}
            />
          )} />
        </Grid>
      </Grid>
    </LocalizationProvider>
  );

  const reviewContent = (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Card elevation={0}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Personal Info</Typography>
            <Divider sx={{ mb: 1 }} />
            <Typography variant="body2"><strong>Name:</strong> {watchedValues.firstName} {watchedValues.lastName}</Typography>
            <Typography variant="body2"><strong>Email:</strong> {watchedValues.email}</Typography>
            <Typography variant="body2"><strong>Phone:</strong> {watchedValues.phone}</Typography>
            {watchedValues.nationalId && <Typography variant="body2"><strong>National ID:</strong> {watchedValues.nationalId}</Typography>}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Card elevation={0}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Lease Details</Typography>
            <Divider sx={{ mb: 1 }} />
            <Typography variant="body2"><strong>Property:</strong> {selectedProperty?.name ?? '—'}</Typography>
            <Typography variant="body2"><strong>Unit:</strong> {watchedValues.unitName}</Typography>
            <Typography variant="body2"><strong>Start:</strong> {watchedValues.leaseStartDate ? format(watchedValues.leaseStartDate, 'MMM d, yyyy') : '—'}</Typography>
            <Typography variant="body2"><strong>End:</strong> {watchedValues.leaseEndDate ? format(watchedValues.leaseEndDate, 'MMM d, yyyy') : '—'}</Typography>
            <Typography variant="body2"><strong>Monthly Rent:</strong> ${watchedValues.monthlyRent?.toLocaleString()}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  if (mode === 'add') {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/tenants')} sx={{ mb: 2 }}>
          Back to Tenants
        </Button>
        <Typography variant="h5" gutterBottom>Add New Tenant</Typography>

        <Stepper activeStep={step} sx={{ mb: 4 }}>
          {ADD_STEPS.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        <Paper elevation={0} sx={{ border: '1px solid #E0E4EF', p: 3, borderRadius: 2 }}>
          {step === 0 && personalFields}
          {step === 1 && leaseFields}
          {step === 2 && reviewContent}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button onClick={() => step === 0 ? navigate('/tenants') : setStep((s) => s - 1)} startIcon={<ArrowBackIcon />}>
              {step === 0 ? 'Cancel' : 'Back'}
            </Button>
            {step < 2 ? (
              <Button variant="contained" onClick={handleNext}>Next →</Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : undefined}
              >
                {isSubmitting ? 'Creating...' : 'Create Tenant'}
              </Button>
            )}
          </Box>
        </Paper>

        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    );
  }

  // Edit mode
  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/tenants/${id}`)} sx={{ mb: 2 }}>
        Back to Tenant
      </Button>
      <Typography variant="h5" gutterBottom>Edit Tenant</Typography>

      <Paper elevation={0} sx={{ border: '1px solid #E0E4EF', p: 3, borderRadius: 2, mb: 10 }}>
        {personalFields}
        <Divider sx={{ my: 3 }} />
        {leaseFields}
        <Divider sx={{ my: 3 }} />
        <Controller name="notes" control={control} render={({ field }) => (
          <TextField {...field} label="Notes" fullWidth multiline rows={3} />
        )} />
      </Paper>

      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          bgcolor: 'background.paper',
          borderTop: '1px solid #E0E4EF',
          p: 2,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          zIndex: 10,
        }}
      >
        <Button onClick={() => navigate(`/tenants/${id}`)}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : undefined}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>

      <Dialog open={blocker.state === 'blocked'} onClose={() => blocker.reset?.()}>
        <DialogTitle>Unsaved Changes</DialogTitle>
        <DialogContent>
          <DialogContentText>You have unsaved changes. Are you sure you want to leave?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => blocker.reset?.()}>Stay</Button>
          <Button color="error" onClick={() => blocker.proceed?.()}>Leave</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
