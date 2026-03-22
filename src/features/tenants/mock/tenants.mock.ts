import { TenantDetail, PaymentRecord, LeaseRecord, ActivityEntry } from '../types/tenant.types';

export const PROPERTIES = [
  { id: 'p1', name: 'Sunrise Tower', units: ['101', '102', '103', '104', '105'] },
  { id: 'p2', name: 'Maple Court', units: ['A1', 'A2', 'B1', 'B2', 'C1'] },
  { id: 'p3', name: 'Harbor View', units: ['301', '302', '303', '304'] },
  { id: 'p4', name: 'Elm Street Flats', units: ['F1', 'F2', 'F3', 'F4', 'F5'] },
  { id: 'p5', name: 'City Center Suites', units: ['S1', 'S2', 'S3', 'S4'] },
];

function makePaymentHistory(monthlyRent: number, months = 6): PaymentRecord[] {
  const records: PaymentRecord[] = [];
  const now = new Date();
  for (let i = 0; i < months; i++) {
    const due = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const isPast = i > 0;
    const status = i === 0 ? 'pending' : i === 1 ? 'overdue' : 'paid';
    records.push({
      id: `pay-${Math.random().toString(36).slice(2)}`,
      amount: monthlyRent,
      dueDate: due.toISOString(),
      paidDate: isPast && status === 'paid' ? new Date(due.getFullYear(), due.getMonth(), 5).toISOString() : undefined,
      status,
      method: status === 'paid' ? (i % 2 === 0 ? 'Bank Transfer' : 'Credit Card') : undefined,
    });
  }
  return records;
}

function makeLeaseHistory(_propertyName: string, _unitName: string): LeaseRecord[] {
  return [
    {
      id: `lease-hist-${Math.random().toString(36).slice(2)}`,
      propertyName: 'Old Property',
      unitName: 'Unit 99',
      startDate: '2021-01-01',
      endDate: '2022-12-31',
      monthlyRent: 1200,
      status: 'expired',
    },
  ];
}

function makeActivityLog(): ActivityEntry[] {
  const actions = [
    'Lease agreement signed',
    'Rent payment received',
    'Maintenance request submitted',
    'Lease renewal initiated',
    'Profile updated',
  ];
  return actions.slice(0, 4).map((action, i) => ({
    id: `act-${Math.random().toString(36).slice(2)}`,
    timestamp: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString(),
    action,
    performedBy: i % 2 === 0 ? 'System' : 'Jane Admin',
  }));
}

const raw: Omit<TenantDetail, 'leaseHistory' | 'paymentHistory' | 'activityLog'>[] = [
  {
    id: 't1', firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@email.com', phone: '+1-555-0101',
    nationalId: 'NID001', leaseStatus: 'active', paymentStatus: 'paid',
    propertyId: 'p1', propertyName: 'Sunrise Tower', unitId: 'u101', unitName: '101',
    leaseStartDate: '2023-01-15', leaseEndDate: '2025-01-14', monthlyRent: 1800,
    createdAt: '2023-01-10T10:00:00Z', updatedAt: '2024-01-10T10:00:00Z',
    notes: 'Long-term tenant, always on time.',
    emergencyContact: { name: 'Bob Johnson', phone: '+1-555-0102', relationship: 'Spouse' },
  },
  {
    id: 't2', firstName: 'Marcus', lastName: 'Williams', email: 'marcus.w@email.com', phone: '+1-555-0201',
    nationalId: 'NID002', leaseStatus: 'overdue', paymentStatus: 'overdue',
    propertyId: 'p1', propertyName: 'Sunrise Tower', unitId: 'u102', unitName: '102',
    leaseStartDate: '2022-06-01', leaseEndDate: '2024-05-31', monthlyRent: 1600,
    createdAt: '2022-05-20T10:00:00Z', updatedAt: '2024-02-01T10:00:00Z',
    notes: 'Second late payment this quarter.',
    emergencyContact: { name: 'Grace Williams', phone: '+1-555-0202', relationship: 'Mother' },
  },
  {
    id: 't3', firstName: 'Sarah', lastName: 'Chen', email: 'sarah.chen@email.com', phone: '+1-555-0301',
    nationalId: 'NID003', leaseStatus: 'active', paymentStatus: 'paid',
    propertyId: 'p2', propertyName: 'Maple Court', unitId: 'uA1', unitName: 'A1',
    leaseStartDate: '2023-03-01', leaseEndDate: '2025-02-28', monthlyRent: 2100,
    createdAt: '2023-02-20T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z',
    emergencyContact: { name: 'David Chen', phone: '+1-555-0302', relationship: 'Father' },
  },
  {
    id: 't4', firstName: 'James', lastName: 'Thompson', email: 'jthompson@email.com', phone: '+1-555-0401',
    leaseStatus: 'pending', paymentStatus: 'pending',
    propertyId: 'p2', propertyName: 'Maple Court', unitId: 'uA2', unitName: 'A2',
    leaseStartDate: '2024-04-01', leaseEndDate: '2025-03-31', monthlyRent: 1950,
    createdAt: '2024-03-15T10:00:00Z', updatedAt: '2024-03-15T10:00:00Z',
  },
  {
    id: 't5', firstName: 'Emily', lastName: 'Rodriguez', email: 'emily.r@email.com', phone: '+1-555-0501',
    nationalId: 'NID005', leaseStatus: 'expiring', paymentStatus: 'paid',
    propertyId: 'p3', propertyName: 'Harbor View', unitId: 'u301', unitName: '301',
    leaseStartDate: '2023-04-01', leaseEndDate: '2024-04-30', monthlyRent: 2500,
    createdAt: '2023-03-20T10:00:00Z', updatedAt: '2024-03-01T10:00:00Z',
    notes: 'Lease expiring soon, needs renewal discussion.',
    emergencyContact: { name: 'Carlos Rodriguez', phone: '+1-555-0502', relationship: 'Father' },
  },
  {
    id: 't6', firstName: 'Kevin', lastName: 'Park', email: 'kpark@email.com', phone: '+1-555-0601',
    nationalId: 'NID006', leaseStatus: 'inactive', paymentStatus: 'paid',
    propertyId: 'p3', propertyName: 'Harbor View', unitId: 'u302', unitName: '302',
    leaseStartDate: '2022-01-01', leaseEndDate: '2023-12-31', monthlyRent: 2200,
    createdAt: '2021-12-15T10:00:00Z', updatedAt: '2024-01-05T10:00:00Z',
  },
  {
    id: 't7', firstName: 'Nina', lastName: 'Patel', email: 'nina.patel@email.com', phone: '+1-555-0701',
    nationalId: 'NID007', leaseStatus: 'active', paymentStatus: 'partial',
    propertyId: 'p4', propertyName: 'Elm Street Flats', unitId: 'uF1', unitName: 'F1',
    leaseStartDate: '2023-07-01', leaseEndDate: '2025-06-30', monthlyRent: 1400,
    createdAt: '2023-06-20T10:00:00Z', updatedAt: '2024-02-10T10:00:00Z',
    emergencyContact: { name: 'Raj Patel', phone: '+1-555-0702', relationship: 'Brother' },
  },
  {
    id: 't8', firstName: 'David', lastName: 'Kim', email: 'dkim@email.com', phone: '+1-555-0801',
    leaseStatus: 'active', paymentStatus: 'paid',
    propertyId: 'p4', propertyName: 'Elm Street Flats', unitId: 'uF2', unitName: 'F2',
    leaseStartDate: '2023-02-01', leaseEndDate: '2025-01-31', monthlyRent: 1350,
    createdAt: '2023-01-25T10:00:00Z', updatedAt: '2024-01-30T10:00:00Z',
  },
  {
    id: 't9', firstName: 'Laura', lastName: 'Martinez', email: 'l.martinez@email.com', phone: '+1-555-0901',
    nationalId: 'NID009', leaseStatus: 'overdue', paymentStatus: 'overdue',
    propertyId: 'p5', propertyName: 'City Center Suites', unitId: 'uS1', unitName: 'S1',
    leaseStartDate: '2023-05-01', leaseEndDate: '2024-04-30', monthlyRent: 3200,
    createdAt: '2023-04-20T10:00:00Z', updatedAt: '2024-03-01T10:00:00Z',
    notes: 'Payment arrangement in progress.',
  },
  {
    id: 't10', firstName: 'Tom', lastName: 'Brown', email: 'tbrown@email.com', phone: '+1-555-1001',
    leaseStatus: 'active', paymentStatus: 'paid',
    propertyId: 'p5', propertyName: 'City Center Suites', unitId: 'uS2', unitName: 'S2',
    leaseStartDate: '2022-10-01', leaseEndDate: '2024-09-30', monthlyRent: 2900,
    createdAt: '2022-09-15T10:00:00Z', updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 't11', firstName: 'Olivia', lastName: 'Davis', email: 'odavis@email.com', phone: '+1-555-1101',
    nationalId: 'NID011', leaseStatus: 'active', paymentStatus: 'paid',
    propertyId: 'p1', propertyName: 'Sunrise Tower', unitId: 'u103', unitName: '103',
    leaseStartDate: '2023-08-01', leaseEndDate: '2025-07-31', monthlyRent: 1750,
    createdAt: '2023-07-20T10:00:00Z', updatedAt: '2024-02-05T10:00:00Z',
    emergencyContact: { name: 'Mark Davis', phone: '+1-555-1102', relationship: 'Husband' },
  },
  {
    id: 't12', firstName: 'Ethan', lastName: 'Garcia', email: 'egarcia@email.com', phone: '+1-555-1201',
    leaseStatus: 'expiring', paymentStatus: 'pending',
    propertyId: 'p1', propertyName: 'Sunrise Tower', unitId: 'u104', unitName: '104',
    leaseStartDate: '2023-05-15', leaseEndDate: '2024-05-14', monthlyRent: 1850,
    createdAt: '2023-05-01T10:00:00Z', updatedAt: '2024-03-10T10:00:00Z',
  },
  {
    id: 't13', firstName: 'Sophia', lastName: 'Wilson', email: 's.wilson@email.com', phone: '+1-555-1301',
    nationalId: 'NID013', leaseStatus: 'active', paymentStatus: 'paid',
    propertyId: 'p2', propertyName: 'Maple Court', unitId: 'uB1', unitName: 'B1',
    leaseStartDate: '2023-09-01', leaseEndDate: '2025-08-31', monthlyRent: 2050,
    createdAt: '2023-08-20T10:00:00Z', updatedAt: '2024-01-25T10:00:00Z',
    emergencyContact: { name: 'Janet Wilson', phone: '+1-555-1302', relationship: 'Mother' },
  },
  {
    id: 't14', firstName: 'Michael', lastName: 'Lee', email: 'mlee@email.com', phone: '+1-555-1401',
    leaseStatus: 'inactive', paymentStatus: 'paid',
    propertyId: 'p2', propertyName: 'Maple Court', unitId: 'uB2', unitName: 'B2',
    leaseStartDate: '2021-06-01', leaseEndDate: '2023-05-31', monthlyRent: 1900,
    createdAt: '2021-05-20T10:00:00Z', updatedAt: '2023-06-01T10:00:00Z',
  },
  {
    id: 't15', firstName: 'Aisha', lastName: 'Hassan', email: 'ahassan@email.com', phone: '+1-555-1501',
    nationalId: 'NID015', leaseStatus: 'active', paymentStatus: 'paid',
    propertyId: 'p3', propertyName: 'Harbor View', unitId: 'u303', unitName: '303',
    leaseStartDate: '2023-11-01', leaseEndDate: '2025-10-31', monthlyRent: 2300,
    createdAt: '2023-10-20T10:00:00Z', updatedAt: '2024-02-15T10:00:00Z',
    notes: 'Reliable tenant, excellent communication.',
    emergencyContact: { name: 'Omar Hassan', phone: '+1-555-1502', relationship: 'Father' },
  },
  {
    id: 't16', firstName: 'Ryan', lastName: 'Taylor', email: 'rtaylor@email.com', phone: '+1-555-1601',
    leaseStatus: 'overdue', paymentStatus: 'overdue',
    propertyId: 'p3', propertyName: 'Harbor View', unitId: 'u304', unitName: '304',
    leaseStartDate: '2022-08-01', leaseEndDate: '2024-07-31', monthlyRent: 2400,
    createdAt: '2022-07-20T10:00:00Z', updatedAt: '2024-03-05T10:00:00Z',
  },
  {
    id: 't17', firstName: 'Priya', lastName: 'Sharma', email: 'psharma@email.com', phone: '+1-555-1701',
    nationalId: 'NID017', leaseStatus: 'active', paymentStatus: 'paid',
    propertyId: 'p4', propertyName: 'Elm Street Flats', unitId: 'uF3', unitName: 'F3',
    leaseStartDate: '2023-04-01', leaseEndDate: '2025-03-31', monthlyRent: 1450,
    createdAt: '2023-03-20T10:00:00Z', updatedAt: '2024-01-30T10:00:00Z',
    emergencyContact: { name: 'Vikram Sharma', phone: '+1-555-1702', relationship: 'Husband' },
  },
  {
    id: 't18', firstName: 'Chris', lastName: 'Anderson', email: 'canderson@email.com', phone: '+1-555-1801',
    leaseStatus: 'pending', paymentStatus: 'pending',
    propertyId: 'p4', propertyName: 'Elm Street Flats', unitId: 'uF4', unitName: 'F4',
    leaseStartDate: '2024-04-15', leaseEndDate: '2025-04-14', monthlyRent: 1380,
    createdAt: '2024-04-01T10:00:00Z', updatedAt: '2024-04-01T10:00:00Z',
  },
  {
    id: 't19', firstName: 'Jennifer', lastName: 'White', email: 'jwhite@email.com', phone: '+1-555-1901',
    nationalId: 'NID019', leaseStatus: 'active', paymentStatus: 'paid',
    propertyId: 'p5', propertyName: 'City Center Suites', unitId: 'uS3', unitName: 'S3',
    leaseStartDate: '2023-01-01', leaseEndDate: '2024-12-31', monthlyRent: 3100,
    createdAt: '2022-12-15T10:00:00Z', updatedAt: '2024-01-10T10:00:00Z',
    notes: 'Corporate tenant, multiple units.',
    emergencyContact: { name: 'Robert White', phone: '+1-555-1902', relationship: 'Spouse' },
  },
  {
    id: 't20', firstName: 'Daniel', lastName: 'Jackson', email: 'djackson@email.com', phone: '+1-555-2001',
    leaseStatus: 'expiring', paymentStatus: 'partial',
    propertyId: 'p5', propertyName: 'City Center Suites', unitId: 'uS4', unitName: 'S4',
    leaseStartDate: '2023-06-01', leaseEndDate: '2024-05-31', monthlyRent: 2800,
    createdAt: '2023-05-20T10:00:00Z', updatedAt: '2024-03-01T10:00:00Z',
  },
  {
    id: 't21', firstName: 'Fatima', lastName: 'Al-Rashid', email: 'farashid@email.com', phone: '+1-555-2101',
    nationalId: 'NID021', leaseStatus: 'active', paymentStatus: 'paid',
    propertyId: 'p1', propertyName: 'Sunrise Tower', unitId: 'u105', unitName: '105',
    leaseStartDate: '2023-10-01', leaseEndDate: '2025-09-30', monthlyRent: 1900,
    createdAt: '2023-09-20T10:00:00Z', updatedAt: '2024-02-20T10:00:00Z',
    emergencyContact: { name: 'Ahmed Al-Rashid', phone: '+1-555-2102', relationship: 'Father' },
  },
  {
    id: 't22', firstName: 'Roberto', lastName: 'Cruz', email: 'rcruz@email.com', phone: '+1-555-2201',
    leaseStatus: 'inactive', paymentStatus: 'paid',
    propertyId: 'p2', propertyName: 'Maple Court', unitId: 'uC1', unitName: 'C1',
    leaseStartDate: '2021-03-01', leaseEndDate: '2023-02-28', monthlyRent: 2000,
    createdAt: '2021-02-15T10:00:00Z', updatedAt: '2023-03-01T10:00:00Z',
  },
  {
    id: 't23', firstName: 'Hannah', lastName: 'Moore', email: 'hmoore@email.com', phone: '+1-555-2301',
    nationalId: 'NID023', leaseStatus: 'active', paymentStatus: 'paid',
    propertyId: 'p3', propertyName: 'Harbor View', unitId: 'u303b', unitName: '303B',
    leaseStartDate: '2023-12-01', leaseEndDate: '2025-11-30', monthlyRent: 2350,
    createdAt: '2023-11-20T10:00:00Z', updatedAt: '2024-02-28T10:00:00Z',
    emergencyContact: { name: 'Liam Moore', phone: '+1-555-2302', relationship: 'Brother' },
  },
  {
    id: 't24', firstName: 'Alexander', lastName: 'Turner', email: 'aturner@email.com', phone: '+1-555-2401',
    leaseStatus: 'overdue', paymentStatus: 'overdue',
    propertyId: 'p4', propertyName: 'Elm Street Flats', unitId: 'uF5', unitName: 'F5',
    leaseStartDate: '2022-11-01', leaseEndDate: '2024-10-31', monthlyRent: 1500,
    createdAt: '2022-10-20T10:00:00Z', updatedAt: '2024-03-10T10:00:00Z',
    notes: 'Under legal review for repeated late payment.',
  },
  {
    id: 't25', firstName: 'Mei', lastName: 'Lin', email: 'mlin@email.com', phone: '+1-555-2501',
    nationalId: 'NID025', leaseStatus: 'pending', paymentStatus: 'pending',
    propertyId: 'p5', propertyName: 'City Center Suites', unitId: 'uS5', unitName: 'S5',
    leaseStartDate: '2024-05-01', leaseEndDate: '2025-04-30', monthlyRent: 3300,
    createdAt: '2024-04-15T10:00:00Z', updatedAt: '2024-04-15T10:00:00Z',
  },
];

export let MOCK_TENANTS: TenantDetail[] = raw.map((t) => ({
  ...t,
  leaseHistory: makeLeaseHistory(t.propertyName, t.unitName),
  paymentHistory: makePaymentHistory(t.monthlyRent),
  activityLog: makeActivityLog(),
}));
