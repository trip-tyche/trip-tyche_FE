import { lazy, Suspense } from 'react';

import { createBrowserRouter, Outlet } from 'react-router-dom';

import { useAuthCheck } from '@/domains/user/hooks/useAuthCheck';
import RootLayout from '@/layouts/RootLayout';
import ErrorPage from '@/pages/ErrorPage';
import MainPage from '@/pages/MainPage';
import NotificationPage from '@/pages/NotificationPage';
import PageNotFound from '@/pages/PageNotFound';
import SettingPage from '@/pages/SettingPage';
import SigninPage from '@/pages/SigninPage';
import TripImageUploadPage from '@/pages/trip/management/TripImageUploadPage';
import TripInfoFormPage from '@/pages/trip/management/TripInfoFormPage';
import UnlocatedImagePage from '@/pages/trip/management/UnlocatedImagePage';
import Indicator from '@/shared/components/common/Spinner/Indicator';
import { ROUTES } from '@/shared/constants/route';

const LoadingSpinner = () => <Indicator text='불러오는 중...' />;

const TripPages = {
    TripImageManagePage: lazy(() => import('@/pages/trip/management/TripImageManagePage')),
    TripRoutePage: lazy(() => import('@/pages/trip/route/TripRoutePage')),
    ImageByPinpointPage: lazy(() => import('@/pages/trip/route/ImageByPinpointPage')),
    ImageByDatePage: lazy(() => import('@/pages/trip/route/ImageByDatePage')),
};

const ProtectedRoute = () => {
    /** TODO
     * 메인 페이지로 진입 시, ProtectedRoute 함수 동작
     * 메인 페이지에서 summary API 요청 방식으로 변경 후 발생
     *  */
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
                <ErrorPage />
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
                        path: ':tripKey',
                        children: [
                            {
                                path: 'images',
                                element: <TripPages.TripImageManagePage />,
                            },
                            {
                                path: 'images/unlocated',
                                element: <UnlocatedImagePage />,
                            },
                            {
                                path: 'images/upload',
                                element: <TripImageUploadPage />,
                            },
                            {
                                path: 'info',
                                element: <TripInfoFormPage />,
                            },
                            {
                                path: 'edit',
                                element: <TripInfoFormPage />,
                            },

                            {
                                path: 'route',
                                element: <TripPages.TripRoutePage />,
                            },
                            {
                                path: 'by-pinpoint/:pinPointId',
                                element: <TripPages.ImageByPinpointPage />,
                            },
                            {
                                path: 'by-date/:date',
                                element: <TripPages.ImageByDatePage />,
                            },
                        ],
                    },
                ],
            },
            {
                path: '/*',
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
