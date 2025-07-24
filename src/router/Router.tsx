import { lazy, Suspense } from 'react';

import { createBrowserRouter } from 'react-router-dom';

import RootLayout from '@/layouts/RootLayout';
import ErrorPage from '@/pages/ErrorPage';
import MainPage from '@/pages/MainPage';
import NotificationPage from '@/pages/NotificationPage';
import PageNotFound from '@/pages/PageNotFound';
import SettingPage from '@/pages/SettingPage';
import SigninPage from '@/pages/SigninPage';
import TripImageManagePage from '@/pages/trip/management/TripImageManagePage';
import TripImageUploadPage from '@/pages/trip/management/TripImageUploadPage';
import TripInfoEditPage from '@/pages/trip/management/TripInfoEditPage';
import TripRoutePage from '@/pages/trip/route/TripRoutePage';
import Indicator from '@/shared/components/common/Spinner/Indicator';
import { ROUTES } from '@/shared/constants/route';

const TripPages = {
    ImageByPinpointPage: lazy(() => import('@/pages/trip/route/ImageByPinpointPage')),
    ImageByDatePage: lazy(() => import('@/pages/trip/route/ImageByDatePage')),
};

const router = createBrowserRouter([
    {
        path: ROUTES.PATH.MAIN,
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <MainPage />,
            },
            {
                path: ROUTES.PATH.SIGNIN,
                element: <SigninPage />,
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
                path: 'trip/:tripKey/',
                children: [
                    {
                        index: true,
                        element: (
                            <Suspense fallback={<Indicator />}>
                                <TripRoutePage />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'new',
                        element: <TripImageUploadPage />,
                    },
                    {
                        path: 'edit/image',
                        element: (
                            <Suspense fallback={<Indicator />}>
                                <TripImageManagePage />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'edit/info',
                        element: <TripInfoEditPage />,
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
                                element: <TripPages.ImageByDatePage />,
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
