// import { createBrowserRouter, Outlet } from 'react-router-dom';
import { useEffect } from 'react';

import { createBrowserRouter, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

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
import { getToken, getUserId } from '@/utils/auth';

const LOGIN_TIMEOUT = 60 * 60 * 1000; // 1시간
const LOGIN_CHECK = 5 * 60 * 1000; // 5분

const LoginCheck = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const { pathname, search } = useLocation();

    useEffect(() => {
        const checkLoginStatus = () => {
            const userId = getUserId();
            const token = getToken();
            const lastLoginTime = localStorage.getItem('lastLoginTime');

            if (!userId || !token) {
                return <Navigate to={`${PATH.AUTH.LOGIN}`} replace state={pathname + search} />;
            }

            const currentTime = new Date().getTime();

            if (!lastLoginTime) {
                return;
            }

            if (currentTime - parseInt(lastLoginTime) > LOGIN_TIMEOUT) {
                localStorage.clear();
                <Navigate to={`${PATH.AUTH.LOGIN}`} replace state={pathname + search} />;
            }
        };

        checkLoginStatus();

        const intervalId = setInterval(checkLoginStatus, LOGIN_CHECK);

        return () => clearInterval(intervalId);
    }, [navigate, pathname, search]);

    return <>{children}</>;
};

const ProtectedRoute = () => (
    <LoginCheck>
        <Outlet />
    </LoginCheck>
);

export const router = createBrowserRouter([
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
                        ],
                    },
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
            { path: '*', element: <PageNotFound /> },
        ],
    },
]);
