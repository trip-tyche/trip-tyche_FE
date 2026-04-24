import { lazy, Suspense } from 'react';

import { createBrowserRouter } from 'react-router-dom';

import RootLayout from '@/layouts/RootLayout';
import ErrorPage from '@/pages/ErrorPage';
import PageNotFound from '@/pages/PageNotFound';
import SigninPage from '@/pages/SigninPage';
import Indicator from '@/shared/components/common/Spinner/Indicator';
import { ROUTES } from '@/shared/constants/route';

const GlobeMapPage = lazy(() => import('@/pages/GlobeMapPage'));
const MainPage = lazy(() => import('@/pages/MainPage'));
const DevPreviewPage = lazy(() => import('@/pages/DevPreviewPage'));
const SettingPage = lazy(() => import('@/pages/SettingPage'));
const NotificationPage = lazy(() => import('@/pages/NotificationPage'));
const TripImageUploadPage = lazy(() => import('@/pages/trip/management/TripImageUploadPage'));
const TripInfoEditPage = lazy(() => import('@/pages/trip/management/TripInfoEditPage'));

const TripPages = {
    ImageByPinpointPage: lazy(() => import('@/pages/trip/route/ImageByPinpointPage')),
    TripRoutePage: lazy(() => import('@/pages/trip/route/TripRoutePage')),
    ImageByDatePage: lazy(() => import('@/pages/trip/route/ImageByDatePage')),
    TripImageManagePage: lazy(() => import('@/pages/trip/management/TripImageManagePage')),
};

const router = createBrowserRouter([
    {
        path: ROUTES.PATH.MAIN,
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            /* ── Public ─────────────────────────── */
            {
                path: ROUTES.PATH.SIGNIN,
                element: <SigninPage />,
            },

            /* ── Protected (로그인 필요 — interceptor가 401 처리) ── */
            {
                index: true,
                element: (
                    <Suspense fallback={<Indicator />}>
                        <GlobeMapPage />
                    </Suspense>
                ),
            },
            {
                path: ROUTES.PATH.TICKETS,
                element: (
                    <Suspense fallback={<Indicator />}>
                        <MainPage />
                    </Suspense>
                ),
            },
            ...(import.meta.env.DEV ? [{
                path: 'preview',
                element: (
                    <Suspense fallback={<Indicator />}>
                        <DevPreviewPage />
                    </Suspense>
                ),
            }] : []),
            {
                path: ROUTES.PATH.SETTING,
                element: (
                    <Suspense fallback={<Indicator />}>
                        <SettingPage />
                    </Suspense>
                ),
            },
            {
                path: `notification/:userId`,
                element: (
                    <Suspense fallback={<Indicator />}>
                        <NotificationPage />
                    </Suspense>
                ),
            },
            {
                path: 'trip/:tripKey/',
                children: [
                    {
                        index: true,
                        element: (
                            <Suspense fallback={<Indicator />}>
                                <TripPages.TripRoutePage />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'new',
                        element: (
                            <Suspense fallback={<Indicator />}>
                                <TripImageUploadPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'edit/image',
                        element: (
                            <Suspense fallback={<Indicator />}>
                                <TripPages.TripImageManagePage />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'edit/info',
                        element: (
                            <Suspense fallback={<Indicator />}>
                                <TripInfoEditPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'image',
                        children: [
                            {
                                path: 'by-pinpoint/:pinPointId',
                                element: (
                                    <Suspense fallback={<Indicator />}>
                                        <TripPages.ImageByPinpointPage />,
                                    </Suspense>
                                ),
                            },
                            {
                                path: 'by-date/:date',
                                element: (
                                    <Suspense fallback={<Indicator />}>
                                        <TripPages.ImageByDatePage />
                                    </Suspense>
                                ),
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        path: '/*',
        element: <PageNotFound />,
    },
]);

export default router;
