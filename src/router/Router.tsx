import { lazy, Suspense } from 'react';

import { createBrowserRouter, Outlet } from 'react-router-dom';

import { useAuthCheck } from '@/domains/user/hooks/useAuthCheck';
import RootLayout from '@/layouts/RootLayout';
import MainPage from '@/pages/MainPage';
import NotificationPage from '@/pages/NotificationPage';
import PageNotFound from '@/pages/PageNotFound';
import SettingPage from '@/pages/SettingPage';
import SigninPage from '@/pages/SigninPage';
import TripListPage from '@/pages/trip/TripListPage';
import Spinner from '@/shared/components/common/Spinner';
import { ROUTES } from '@/shared/constants/paths';

const LoadingSpinner = () => <Spinner loadingText='불러오는 중...' />;

const TripPages = {
    Management: {
        TripImageManagePage: lazy(() => import('@/pages/trip/management/TripImageManagePage')),
        TripImageUploadPage: lazy(() => import('@/pages/trip/management/TripImageUploadPage')),
        TripInfoFormPage: lazy(() => import('@/pages/trip/management/TripInfoFormPage')),
    },
    Route: {
        TripRoutePage: lazy(() => import('@/pages/trip/route/TripRoutePage')),
        ImageByPinpointPage: lazy(() => import('@/pages/trip/route/ImageByPinpointPage')),
        ImageByDatePage: lazy(() => import('@/pages/trip/route/ImageByDatePage')),
    },
};

const ProtectedRoute = () => {
    const { isChecking } = useAuthCheck();

    if (isChecking) {
        return <LoadingSpinner />;
    }

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Outlet />
        </Suspense>
    );
};

const router = createBrowserRouter([
    {
        path: ROUTES.PATH.MAIN,
        element: <RootLayout />,
        errorElement: (
            <Suspense fallback={<LoadingSpinner />}>
                <PageNotFound />
            </Suspense>
        ),
        children: [
            {
                path: ROUTES.PATH.SIGNIN,
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <SigninPage />
                    </Suspense>
                ),
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        index: true,
                        element: <MainPage />,
                    },
                    {
                        path: ROUTES.PATH.SETTING,
                        element: <SettingPage />,
                    },
                    {
                        path: `notification/:userId`,
                        element: <NotificationPage />,
                    },

                    {
                        path: ROUTES.PATH.TRIP.ROOT,
                        element: <TripListPage />,
                    },
                    {
                        path: 'trip/:tripKey',
                        children: [
                            {
                                path: 'images',
                                element: <TripPages.Management.TripImageManagePage />,
                            },
                            {
                                path: 'images/upload',
                                element: <TripPages.Management.TripImageUploadPage />,
                            },
                            {
                                path: 'info',
                                element: <TripPages.Management.TripInfoFormPage />,
                            },
                            {
                                path: 'edit',
                                element: <TripPages.Management.TripInfoFormPage />,
                            },

                            {
                                path: 'route',
                                element: <TripPages.Route.TripRoutePage />,
                            },
                            {
                                path: 'by-pinpoint/:pinPointId',
                                element: <TripPages.Route.ImageByPinpointPage />,
                            },
                            {
                                path: 'by-date/:date',
                                element: <TripPages.Route.ImageByDatePage />,
                            },
                        ],
                    },
                ],
            },
            {
                path: '*',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <PageNotFound />
                    </Suspense>
                ),
            },
        ],
    },
]);

export default router;
