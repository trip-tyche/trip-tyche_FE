// import { lazy, useEffect } from 'react';

// import { createBrowserRouter, Outlet, useLocation, useNavigate } from 'react-router-dom';

// import { ROUTES } from '@/constants/paths';
// import RootLayout from '@/layouts/RootLayout';
// import LoginPage from '@/pages/LoginPage';
// import LoginRedirectPage from '@/pages/LoginRedirectPage';
// import MainPage from '@/pages/MainPage';
// import Onboarding from '@/pages/Onboarding';
// import PageNotFound from '@/pages/PageNotFound';
// import SettingPage from '@/pages/SettingPage';
// import TimelineDatePage from '@/pages/trips/timeline/TimelineDatePage';
// import TimelineMapPage from '@/pages/trips/timeline/TimelineMapPage';
// import TimelinePinpointPage from '@/pages/trips/timeline/TimelinePinpointPage';
// import TripImageUploadPage from '@/pages/trips/TripImageUploadPage';
// import TripInfoEditPage from '@/pages/trips/TripInfoEditPage';
// import TripInfoPage from '@/pages/trips/TripInfoPage';
// import TripLocationAddPage from '@/pages/trips/TripLocationAddPage';
// import TripTicketListPage from '@/pages/trips/TripTicketListPage';
// import { useToastStore } from '@/stores/useToastStore';
// import { validateUserAuth } from '@/utils/validation';

// const LOGIN_TIMEOUT = 100 * 60 * 1000; // 10분
// const LOGIN_CHECK = 10 * 60 * 1000; // 1분

// const LoginCheck = ({ children }: { children: JSX.Element }) => {
//     const navigate = useNavigate();
//     const { pathname, search } = useLocation();
//     const showToast = useToastStore((state) => state.showToast);

//     useEffect(() => {
//         const checkLoginStatus = () => {
//             const isValid = validateUserAuth();
//             const lastLoginTime = localStorage.getItem('lastLoginTime') || '';

//             if (!isValid || !lastLoginTime) {
//                 navigate(ROUTES.PATH.AUTH.LOGIN, {
//                     replace: true,
//                     state: pathname + search,
//                 });
//                 return;
//             }

//             const currentTime = new Date().getTime();
//             const isTimeout = currentTime - parseInt(lastLoginTime) > LOGIN_TIMEOUT;

//             if (isTimeout) {
//                 localStorage.clear();
//                 navigate(ROUTES.PATH.AUTH.LOGIN, {
//                     replace: true,
//                     state: pathname + search,
//                 });
//                 showToast('자동 로그아웃되었습니다. 다시 로그인해 주세요.');
//             }
//         };

//         checkLoginStatus();

//         const intervalId = setInterval(checkLoginStatus, LOGIN_CHECK);

//         return () => clearInterval(intervalId);
//     }, [navigate, pathname, search, showToast]);

//     return <>{children}</>;
// };

// const ProtectedRoute = () => (
//     <LoginCheck>
//         <Outlet />
//     </LoginCheck>
// );

// const router = createBrowserRouter([
//     {
//         path: ROUTES.PATH.MAIN,
//         element: <RootLayout />,
//         errorElement: <PageNotFound />,
//         children: [
//             { path: ROUTES.PATH.ONBOARDING, element: <Onboarding /> },
//             { path: ROUTES.PATH.AUTH.LOGIN, element: <LoginPage /> },
//             { path: ROUTES.PATH.AUTH.LOGIN_REDIRECT, element: <LoginRedirectPage /> },
//             {
//                 element: <ProtectedRoute />,
//                 children: [
//                     { index: true, element: <MainPage /> },
//                     { path: ROUTES.PATH.SETTING, element: <SettingPage /> },

//                     { path: ROUTES.PATH.TRIPS.ROOT, element: <TripTicketListPage /> },
//                     {
//                         path: 'trips/:tripId',
//                         children: [
//                             {
//                                 path: 'new',
//                                 children: [
//                                     { path: 'images', element: <TripImageUploadPage /> },
//                                     { path: 'locations', element: <TripLocationAddPage /> },
//                                     { path: 'info', element: <TripInfoPage /> },
//                                 ],
//                             },
//                             { path: 'edit', element: <TripInfoEditPage /> },
//                             {
//                                 path: 'timeline',
//                                 children: [
//                                     { path: 'map', element: <TimelineMapPage /> },
//                                     { path: 'pinpoint/:pinPointId', element: <TimelinePinpointPage /> },
//                                     { path: 'date', element: <TimelineDatePage /> },
//                                 ],
//                             },
//                         ],
//                     },
//                 ],
//             },
//             { path: '*', element: <PageNotFound /> },
//         ],
//     },
// ]);

// export default router;

import { useEffect, lazy, Suspense } from 'react';

import { createBrowserRouter, Outlet, useLocation, useNavigate } from 'react-router-dom';

import Spinner from '@/components/common/Spinner';
import { ROUTES } from '@/constants/paths';
import RootLayout from '@/layouts/RootLayout';
import NotificationPage from '@/pages/NotificationPage';
import { useToastStore } from '@/stores/useToastStore';
import { validateUserAuth } from '@/utils/validation';

// 로딩 컴포넌트
const LoadingSpinner = () => <Spinner />;

// 지연 로딩할 컴포넌트들
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const LoginRedirectPage = lazy(() => import('@/pages/LoginRedirectPage'));
const MainPage = lazy(() => import('@/pages/MainPage'));
const Onboarding = lazy(() => import('@/pages/Onboarding'));
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

const LOGIN_TIMEOUT = 100 * 60 * 1000; // 10분
const LOGIN_CHECK = 10 * 60 * 1000; // 1분

const LoginCheck = ({ children }: { children: JSX.Element }) => {
    const navigate = useNavigate();
    const { pathname, search } = useLocation();
    const showToast = useToastStore((state) => state.showToast);

    useEffect(() => {
        const checkLoginStatus = () => {
            const isValid = validateUserAuth();
            const lastLoginTime = localStorage.getItem('lastLoginTime') || '';

            if (!isValid || !lastLoginTime) {
                navigate(ROUTES.PATH.AUTH.LOGIN, {
                    replace: true,
                    state: pathname + search,
                });
                return;
            }

            const currentTime = new Date().getTime();
            const isTimeout = currentTime - parseInt(lastLoginTime) > LOGIN_TIMEOUT;

            if (isTimeout) {
                localStorage.clear();
                navigate(ROUTES.PATH.AUTH.LOGIN, {
                    replace: true,
                    state: pathname + search,
                });
                showToast('자동 로그아웃되었습니다. 다시 로그인해 주세요.');
            }
        };

        checkLoginStatus();
        const intervalId = setInterval(checkLoginStatus, LOGIN_CHECK);
        return () => clearInterval(intervalId);
    }, [navigate, pathname, search, showToast]);

    return <>{children}</>;
};

const ProtectedRoute = () => (
    <LoginCheck>
        <Suspense fallback={<LoadingSpinner />}>
            <Outlet />
        </Suspense>
    </LoginCheck>
);

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
                path: ROUTES.PATH.ONBOARDING,
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <Onboarding />
                    </Suspense>
                ),
            },
            {
                path: ROUTES.PATH.AUTH.LOGIN,
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <LoginPage />
                    </Suspense>
                ),
            },
            {
                path: ROUTES.PATH.AUTH.LOGIN_REDIRECT,
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <LoginRedirectPage />
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
                        path: ROUTES.PATH.SHARE,
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
