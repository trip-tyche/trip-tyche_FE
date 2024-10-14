// import { createBrowserRouter, Outlet } from 'react-router-dom';
import { useEffect } from 'react';

import { createBrowserRouter, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

import RootLayout from '../layouts/RootLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import MyPage from '../pages/MyPage';
import PageNotFound from '../pages/PageNotFound';
import TripList from '../pages/Trip/TripList';
import { PATH } from '@/constants/path';
import DayImages from '@/pages/DayImages';
import LoginRedirectPage from '@/pages/LoginRedirectPage';
import MusicVideo from '@/pages/MusicVideo';
import Onboarding from '@/pages/Onboarding';
import AddLocation from '@/pages/Trip/AddLocation';
import NewTrip from '@/pages/Trip/NewTrip';
import TimelineMap from '@/pages/Trip/TimelineMap';
import TripEdit from '@/pages/Trip/TripEdit';
import TripFileUpload from '@/pages/Trip/TripFileUpload';
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
                return <Navigate to={`${PATH.LOGIN}`} replace state={pathname + search} />;
            }

            const currentTime = new Date().getTime();

            if (!lastLoginTime) {
                return;
            }

            if (currentTime - parseInt(lastLoginTime) > LOGIN_TIMEOUT) {
                localStorage.clear();
                <Navigate to={`${PATH.LOGIN}`} replace state={pathname + search} />;
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
        path: PATH.HOME,
        element: <RootLayout />,
        errorElement: <PageNotFound />,
        children: [
            { path: PATH.ONBOARDING, element: <Onboarding /> },
            { path: PATH.LOGIN, element: <Login /> },
            {
                path: PATH.LOGIN_REDIRECT,
                element: <LoginRedirectPage />,
            },
            {
                element: <ProtectedRoute />,
                children: [
                    { index: true, element: <Home /> },
                    { path: PATH.MYPAGE, element: <MyPage /> },
                    { path: PATH.TRIP_LIST, element: <TripList /> },
                    { path: PATH.TRIP_NEW, element: <NewTrip /> },
                    { path: PATH.TRIP_UPLOAD, element: <TripFileUpload /> },
                    { path: PATH.TRIP_UPLOAD_ADD_LOCATION, element: <AddLocation /> },
                    { path: PATH.TRIPS_EDIT, element: <TripEdit /> },
                    { path: `${PATH.TIMELINE_MAP}/:tripId`, element: <TimelineMap /> },
                    { path: `${PATH.MUSIC_VIDEO}/:tripId/:pinPointId`, element: <MusicVideo /> },
                    { path: PATH.DAY_IMAGES, element: <DayImages /> },
                    { path: '/onboarding', element: <Onboarding /> },
                ],
            },
            { path: '*', element: <PageNotFound /> },
        ],
    },
]);
