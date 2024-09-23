import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router-dom';

import RootLayout from '../layouts/RootLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import MyPage from '../pages/MyPage';
import PageNotFound from '../pages/PageNotFound';
import TripList from '../pages/Trip/TripList';
import { PATH } from '@/constants/path';
import LoginRedirectPage from '@/pages/LoginRedirectPage';
import TripCreateInfo from '@/pages/Trip/TripCreateInfo';
import TripEdit from '@/pages/Trip/TripEdit';
import TripFileUpload from '@/pages/Trip/TripFileUpload';
import TripMap from '@/pages/Trip/TripMap';

// const AuthProtectedRoute = () => {
//     // 현재 경로와 URL쿼리 문자열 가져옴
//     const { pathname, search } = useLocation();
//     const isLogin = useLoginStore((state) => state.isLogin);
//     return isLogin ? <Outlet /> : <Navigate to={`${PATH.LOGIN}`} replace state={pathname + search} />;
// };

const ProtectedRoute = () => {
    const { pathname, search } = useLocation();
    // const isLogIn = useAuthStore((state) => state.isLogIn);
    const isLogIn = true; // 임시로

    return isLogIn ? <Outlet /> : <Navigate to={`${PATH.LOGIN}`} replace state={pathname + search} />;
};
export const router = createBrowserRouter([
    {
        path: PATH.HOME,
        element: <RootLayout />,
        errorElement: <PageNotFound />,
        children: [
            { path: PATH.LOGIN, element: <Login /> },
            {
                element: <ProtectedRoute />,
                children: [
                    { index: true, element: <Home /> },
                    {
                        path: PATH.MYPAGE,
                        children: [
                            { index: true, element: <MyPage /> },
                            //   { path: PATH.SETTINGS, element: <Settings /> },
                        ],
                    },
                    { path: PATH.TRIP_LIST, element: <TripList /> },
                    {
                        path: PATH.TRIP_NEW,
                        element: <TripCreateInfo />,
                    },
                    { path: PATH.TRIP_UPLOAD, element: <TripFileUpload /> },

                    { path: PATH.TRIPS_EDIT, element: <TripEdit /> },
                    { path: `${PATH.TIMELINE_MAP}:tripId`, element: <TripMap /> },
                    //   { path: PATH.ONBOARDING, element: <Onboarding /> },
                    //   { path: '/test', element: <Test /> },
                    {
                        path: PATH.LOGIN_REDIRECT,
                        element: <LoginRedirectPage />,
                    },
                ],
            },
        ],
    },
]);
