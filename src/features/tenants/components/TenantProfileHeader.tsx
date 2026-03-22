import React, { useState } from 'react';
import { Paper, Box, Avatar, Typography, Chip, Button, IconButton, Menu, MenuItem, ListItemIcon } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArchiveIcon from '@mui/icons-material/Archive';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';
import { TenantDetail } from '../types/tenant.types';
import TenantStatusChip from './TenantStatusChip';

interface TenantProfileHeaderProps {
  tenant: TenantDetail;
  onSendReminder?: () => void;
}

export default function TenantProfileHeader({ tenant, onSendReminder }: TenantProfileHeaderProps) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <Paper elevation={0} sx={{ border: '1px solid #E0E4EF', p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
        <Avatar sx={{ width: 80, height: 80, fontSize: 28, bgcolor: 'primary.main' }}>
          {tenant.firstName[0]}{tenant.lastName[0]}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight={700}>
            {tenant.firstName} {tenant.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">{tenant.email}</Typography>
          <Typography variant="body2" color="text.secondary">{tenant.phone}</Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
            <TenantStatusChip status={tenant.leaseStatus} />
            <Chip variant="outlined" size="small" label={tenant.propertyName} />
            <Chip variant="outlined" size="small" label={`Unit ${tenant.unitName}`} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/tenants/${tenant.id}/edit`)}
          >
            Edit
          </Button>
          <IconButton
            aria-label="more tenant actions"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={() => { setAnchorEl(null); }}>
              <ListItemIcon><ArchiveIcon fontSize="small" /></ListItemIcon>
              Archive
            </MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); onSendReminder?.(); }}>
              <ListItemIcon><NotificationsIcon fontSize="small" /></ListItemIcon>
              Send Reminder
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Paper>
  );
}
