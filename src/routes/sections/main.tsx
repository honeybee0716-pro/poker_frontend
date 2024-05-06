import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import AuthGuard from 'src/utils/authguard';
// layouts
import DashboardLayout from 'src/layouts/global';
// components
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/home'));
const ProfilePage = lazy(() => import('src/pages/home/profile'));
// const AgentsPage = lazy(() => import('src/pages/home/agents'));
// const BalancePage = lazy(() => import('src/pages/home/balance'));

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
      { path: 'lobby', element: <IndexPage /> },
      { path: 'profile', element: <ProfilePage /> },
      // { path: 'record', element: <RecordsPage /> },
      // { path: 'balance', element: <BalancePage /> },
    ],
  },
];
