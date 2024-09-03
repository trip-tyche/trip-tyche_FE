import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router-dom';

import RootLayout from '../layouts/RootLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import MyPage from '../pages/MyPage';
import PageNotFound from '../pages/PageNotFound';
import Trips from '../pages/Trip/Trips';
import { PATH } from '@/constants/path';
import TripCreateInfo from '@/pages/Trip/TripCreateInfo';
import TripEdit from '@/pages/Trip/TripEdit';
import TripFileUpload from '@/pages/Trip/TripFileUpload';
import TripMap from '@/pages/Trip/TripMap';

const AuthProtectedRoute = () => {
    // 현재 경로와 URL쿼리 문자열 가져옴
    const { pathname, search } = useLocation();

    const authOK = true; // 로그인 여부 확인(임시)

    // 로그인 통과? 그럼 Outlet을 렌더링
    // 로그인 실패? 로그인 페이지로 Redirect
    // <Outlet/>: 자식 라우트를 렌더링
    // replace: 현재 페이지를 브라우저 히스토리에서 교체
    // state={..} :현재 URL 정보를 로그인 페이지로 전달
    // return authOK ? <Outlet /> : <Navigate to={`${PATH.SIGNIN}`} replace state={pathname + search} />;
    return authOK ? <Outlet /> : <Navigate to={`${PATH.LOGIN}`} replace state={pathname + search} />;
};
export const router = createBrowserRouter([
    {
        path: PATH.HOME,
        element: <RootLayout />,
        errorElement: <PageNotFound />,
        children: [
            { path: PATH.LOGIN, element: <Login /> },
            {
                element: <AuthProtectedRoute />,
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
                ],
            },
        ],
    },
]);
