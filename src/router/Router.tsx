import { useEffect } from 'react';

import { createBrowserRouter, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { PATH } from '@/constants/path';
import RootLayout from '@/layouts/RootLayout';
import LoginPage from '@/pages/LoginPage';
import LoginRedirectPage from '@/pages/LoginRedirectPage';
import MainPage from '@/pages/MainPage';
import Onboarding from '@/pages/Onboarding';
import PageNotFound from '@/pages/PageNotFound';
import SettingPage from '@/pages/SettingPage';
import TimelineDatePage from '@/pages/trips/timeline/TimelineDatePage';
import TimelineMapPage from '@/pages/trips/timeline/TimelineMapPage';
import TimelinePinpointPage from '@/pages/trips/timeline/TimelinePinpointPage';
import TripImageUploadPage from '@/pages/trips/TripImageUploadPage';
import TripInfoEditPage from '@/pages/trips/TripInfoEditPage';
import TripInfoPage from '@/pages/trips/TripInfoPage';
import TripLocationAddPage from '@/pages/trips/TripLocationAddPage';
import TripTicketListPage from '@/pages/trips/TripTicketListPage';
import { useToastStore } from '@/stores/useToastStore';
import { validateUserAuth } from '@/utils/validation';

const LOGIN_TIMEOUT = 10 * 60 * 1000; // 10분
const LOGIN_CHECK = 1 * 60 * 1000; // 1분

const LoginCheck = ({ children }: { children: JSX.Element }) => {
    const navigate = useNavigate();
    const { pathname, search } = useLocation();
    const showToast = useToastStore((state) => state.showToast);

    useEffect(() => {
        const checkLoginStatus = () => {
            const isValid = validateUserAuth();
            const lastLoginTime = localStorage.getItem('lastLoginTime') || '';

            if (!isValid || !lastLoginTime) {
                navigate(PATH.AUTH.LOGIN, {
                    replace: true,
                    state: pathname + search,
                });
                return;
            }

            const currentTime = new Date().getTime();
            const isTimeout = currentTime - parseInt(lastLoginTime) > LOGIN_TIMEOUT;

            if (isTimeout) {
                localStorage.clear();
                navigate(PATH.AUTH.LOGIN, {
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
        <Outlet />
    </LoginCheck>
);

const router = createBrowserRouter([
    {
        path: PATH.MAIN,
        element: <RootLayout />,
        errorElement: <PageNotFound />,
        children: [
            { path: PATH.ONBOARDING, element: <Onboarding /> },
            { path: PATH.AUTH.LOGIN, element: <LoginPage /> },
            { path: PATH.AUTH.LOGIN_REDIRECT, element: <LoginRedirectPage /> },
            {
                element: <ProtectedRoute />,
                children: [
                    { index: true, element: <MainPage /> },
                    { path: PATH.SETTING, element: <SettingPage /> },

                    { path: PATH.TRIPS.ROOT, element: <TripTicketListPage /> },
                    {
                        path: 'trips/:tripId',
                        children: [
                            {
                                path: 'new',
                                children: [
                                    { path: 'images', element: <TripImageUploadPage /> },
                                    { path: 'locations', element: <TripLocationAddPage /> },
                                    { path: 'info', element: <TripInfoPage /> },
                                ],
                            },
                            { path: 'edit', element: <TripInfoEditPage /> },
                            {
                                path: 'timeline',
                                children: [
                                    { path: 'map', element: <TimelineMapPage /> },
                                    { path: 'pinpoint/:pinPointId', element: <TimelinePinpointPage /> },
                                    { path: 'date', element: <TimelineDatePage /> },
                                ],
                            },
                        ],
                    },
                ],
            },
            { path: '*', element: <PageNotFound /> },
        ],
    },
]);

export default router;
