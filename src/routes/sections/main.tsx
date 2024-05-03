import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import AuthGuard from 'src/utils/authguard';
// layouts
import DashboardLayout from 'src/layouts/global';
// components
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/home/uesrs'));
const RecordsPage = lazy(() => import('src/pages/home/records'));
const AgentsPage = lazy(() => import('src/pages/home/agents'));
const BalancePage = lazy(() => import('src/pages/home/balance'));

export const mainRoutes = [
  {
    path: '/',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      { path: 'users', element: <IndexPage /> },
      { path: 'agents', element: <AgentsPage /> },
      { path: 'record', element: <RecordsPage /> },
      { path: 'balance', element: <BalancePage /> },
    ],
  },
];
