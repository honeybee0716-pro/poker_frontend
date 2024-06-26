import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import AuthGuard from 'src/utils/authguard';
// layouts
import DashboardLayout from 'src/layouts/global';
// components
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/home/lobby'));
const BoardPage = lazy(() => import('src/pages/home/board'));
const BoardDetailPage = lazy(() => import('src/pages/home/board-detail'));
const RankingPage = lazy(() => import('src/pages/home/ranking'));
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
      { path: 'board', element: <BoardPage /> },
      { path: 'board/:id', element: <BoardDetailPage /> },
      { path: 'ranking', element: <RankingPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'wallet', element: <WalletPage /> },
    ],
  },
];
