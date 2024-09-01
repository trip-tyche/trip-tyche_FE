import { createBrowserRouter } from 'react-router-dom';

import Root from '../layouts/Root';
import Home from '../pages/Home';
import Login from '../pages/Login';
import MusicVideo from '../pages/MusicVideo';
import MyPage from '../pages/MyPage';
import PageNotFound from '../pages/PageNotFound';
import Redirection from '../pages/Redirection';
import TimeLine from '../pages/Trip/TimeLine';
import TripCreate from '../pages/Trip/TripCreate';
import TripList from '../pages/Trip/TripList';
import TripEdit from '@/pages/Trip/TripEdit';
import TripFile from '@/pages/Trip/TripFile';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <PageNotFound />,
        children: [
            {
                index: true,
                element: <Login />,
            },
            {
                path: 'home',
                element: <Home />,
            },
            {
                path: 'trips',
                element: <TripList />,
                children: [
                    {
                        path: ':tripId/edit',
                        element: <TripEdit />,
                    },
                    {
                        path: ':tripId/map',
                        element: <TimeLine />,
                        children: [
                            {
                                path: 'points/{pointId}/music-video',
                                element: <MusicVideo />,
                            },
                        ],
                    },
                ],
            },
            {
                path: 'trips/new',
                element: <TripCreate />,
            },
            {
                path: 'trips/new/file',
                element: <TripFile />,
            },

            {
                path: '/my-page',
                element: <MyPage />,
            },
            {
                path: '/kakao/callback',
                element: <Redirection />,
            },
        ],
    },
]);
