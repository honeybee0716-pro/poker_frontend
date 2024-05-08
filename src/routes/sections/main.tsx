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
const WalletPage = lazy(() => import('src/pages/home/wallet'));

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
      { path: 'wallet', element: <WalletPage /> },
    ],
  },
];
