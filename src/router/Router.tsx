import { createBrowserRouter } from 'react-router-dom';
import PageNotFound from '../pages/PageNotFound';
import Root from '../layouts/Root';
import Home from '../pages/Home';
import TripList from '../pages/TripList';
import TripCreate from '../pages/TripCreate';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <PageNotFound />,
    children: [
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'trip-list',
        element: <TripList />,
      },
      {
        path: 'trip-create',
        element: <TripCreate />,
      },
    ],
  },
]);
