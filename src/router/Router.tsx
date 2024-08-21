import { createBrowserRouter } from 'react-router-dom';
import PageNotFound from '../pages/PageNotFound';
import Root from '../layouts/Root';
import Home from '../pages/Home';
import TripList from '../pages/TripList';
import TripCreate from '../pages/TripCreate';
import Login from '../pages/Login';
import MyPage from '../pages/MyPage';
import TimeLine from '../pages/TimeLine';
import MusicVideo from '../pages/MusicVideo';
import Redirection from '../pages/Redirection';

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
        path: 'trip-list',
        element: <TripList />,
        children: [
          {
            path: 'timeline/:tripId',
            element: <TimeLine />,
          },
          {
            path: 'timeline/:tripId/musicvideo/:pointId',
            element: <MusicVideo />,
          },
        ],
      },
      {
        path: 'trip-create',
        element: <TripCreate />,
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
