import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router-dom';

import RootLayout from '../layouts/RootLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import MyPage from '../pages/MyPage';
import PageNotFound from '../pages/PageNotFound';
import TripList from '../pages/Trip/TripList';
import { PATH } from '@/constants/path';
import LoginRedirectPage from '@/pages/LoginRedirectPage';
import Onboarding from '@/pages/Onboarding';
import AddLocation from '@/pages/Trip/AddLocation';
import NewTrip from '@/pages/Trip/NewTrip';
import TimelineMap from '@/pages/Trip/TimelineMap';
import TripEdit from '@/pages/Trip/TripEdit';
import TripFileUpload from '@/pages/Trip/TripFileUpload';
import { getToken, getUserId } from '@/utils/auth';

const ProtectedRoute = () => {
    const { pathname, search } = useLocation();
    const userId = getUserId();
    const token = getToken();

    // userId, 토큰 유효성 검사
    if (!userId || !token) {
        return <Navigate to={`${PATH.LOGIN}`} replace state={pathname + search} />;
    }

    // // 토큰 만료 검사 (예: JWT 디코딩)
    // const isTokenExpired = checkTokenExpiration(token); // 이 함수는 직접 구현해야 합니다
    // if (isTokenExpired) {
    //     // 토큰 갱신 로직 또는 로그아웃 처리
    //     useAuthStore.getState().logout();
    //     return <Navigate to={`${PATH.LOGIN}`} replace state={pathname + search} />;
    // }

    return <Outlet />;
};

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
                ],
            },
            { path: '*', element: <PageNotFound /> },
        ],
    },
]);
