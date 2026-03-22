import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import TenantListPage from './pages/tenants/TenantListPage';
import TenantDetailsPage from './pages/tenants/TenantDetailsPage';
import TenantFormPage from './pages/tenants/TenantFormPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/tenants" replace /> },
      { path: 'tenants', element: <TenantListPage /> },
      { path: 'tenants/new', element: <TenantFormPage mode="add" /> },
      { path: 'tenants/:id', element: <TenantDetailsPage /> },
      { path: 'tenants/:id/edit', element: <TenantFormPage mode="edit" /> },
    ],
  },
]);
