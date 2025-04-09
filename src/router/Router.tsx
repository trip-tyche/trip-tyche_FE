import { lazy, Suspense, useEffect, useState } from 'react';

import { createBrowserRouter, Outlet, useLocation } from 'react-router-dom';

import { userAPI } from '@/api';
import Spinner from '@/components/common/Spinner';
import { ROUTES } from '@/constants/paths';
import RootLayout from '@/layouts/RootLayout';
import NotificationPage from '@/pages/NotificationPage';
import useUserStore from '@/stores/useUserStore';

// 로딩 컴포넌트
const LoadingSpinner = () => <Spinner loadingText='불러오는 중...' />;

// 지연 로딩할 컴포넌트들
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const MainPage = lazy(() => import('@/pages/MainPage'));
const PageNotFound = lazy(() => import('@/pages/PageNotFound'));
const SettingPage = lazy(() => import('@/pages/SettingPage'));

// 여행 관련 페이지들을 그룹화하여 지연 로딩
const TripPages = {
    TripTicketListPage: lazy(() => import('@/pages/trips/TripTicketListPage')),
    TripImageManagePage: lazy(() => import('@/pages/trips/TripImageManagePage')),
    TripImageUploadPage: lazy(() => import('@/pages/trips/TripImageUploadPage')),
    TripLocationAddPage: lazy(() => import('@/pages/trips/TripLocationAddPage')),
    TripInfoPage: lazy(() => import('@/pages/trips/TripInfoPage')),
    TripInfoEditPage: lazy(() => import('@/pages/trips/TripInfoEditPage')),
};

// 타임라인 관련 페이지들을 그룹화하여 지연 로딩
const TimelinePages = {
    TimelineMapPage: lazy(() => import('@/pages/trips/timeline/TimelineMapPage')),
    TimelinePinpointPage: lazy(() => import('@/pages/trips/timeline/TimelinePinpointPage')),
    TimelineDatePage: lazy(() => import('@/pages/trips/timeline/TimelineDatePage')),
};

const ProtectedRoute = () => {
    const [isChecking, setIsChecking] = useState(true);
    const { login, logout, isAuthenticated } = useUserStore();

    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (isAuthenticated) return;
                const userInfo = (await userAPI.fetchUserInfo()).data;
                login(userInfo);
            } catch (error) {
                logout();
            } finally {
                setIsChecking(false);
            }
        };

        setIsChecking(true);
        checkAuth();
    }, [location.pathname, isAuthenticated, login, logout]);

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
                path: ROUTES.PATH.AUTH.LOGIN,
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <LoginPage />
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
                        path: ROUTES.PATH.TRIPS.ROOT,
                        element: <TripPages.TripTicketListPage />,
                    },
                    {
                        path: 'trips/:tripId',
                        children: [
                            {
                                path: 'images',
                                element: <TripPages.TripImageManagePage />,
                            },
                            {
                                path: 'new',
                                children: [
                                    {
                                        path: 'images',
                                        element: <TripPages.TripImageUploadPage />,
                                    },
                                    {
                                        path: 'locations',
                                        element: <TripPages.TripLocationAddPage />,
                                    },
                                    {
                                        path: 'info',
                                        element: <TripPages.TripInfoPage />,
                                    },
                                ],
                            },
                            {
                                path: 'edit',
                                element: <TripPages.TripInfoEditPage />,
                            },
                            {
                                path: 'timeline',
                                children: [
                                    {
                                        path: 'map',
                                        element: <TimelinePages.TimelineMapPage />,
                                    },
                                    {
                                        path: 'pinpoint/:pinPointId',
                                        element: <TimelinePages.TimelinePinpointPage />,
                                    },
                                    {
                                        path: 'date',
                                        element: <TimelinePages.TimelineDatePage />,
                                    },
                                ],
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
