import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router-dom';

import RootLayout from '../layouts/RootLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import MyPage from '../pages/MyPage';
import PageNotFound from '../pages/PageNotFound';
import Trips from '../pages/Trip/Trips';
import { PATH } from '@/constants/path';
import OAuthSuccessPage from '@/pages/OAuthSuccessPage';
import TripCreateInfo from '@/pages/Trip/TripCreateInfo';
import TripEdit from '@/pages/Trip/TripEdit';
import TripFileUpload from '@/pages/Trip/TripFileUpload';
import TripMap from '@/pages/Trip/TripMap';
import useAuthStore from '@/stores/useAuthStore';

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
                    { path: PATH.TRIPS, element: <Trips /> },
                    {
                        path: PATH.TRIP_CREATE_INFO,
                        element: <TripCreateInfo />,
                    },
                    { path: PATH.TRIP_UPLOAD, element: <TripFileUpload /> },

                    { path: PATH.TRIPS_EDIT, element: <TripEdit /> },
                    { path: PATH.TRIP_MAP, element: <TripMap /> },
                    //   { path: PATH.ONBOARDING, element: <Onboarding /> },
                    //   { path: '/test', element: <Test /> },
                    {
                        path: PATH.OAUTH_SUCCESS,
                        element: <OAuthSuccessPage />,
                    },
                ],
            },
        ],
    },
]);
