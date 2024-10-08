import { MantineProvider } from '@mantine/core';
import { RouterProvider } from 'react-router-dom';

import '@mantine/dates/styles.css';
import '@mantine/core/styles.css';

import { router } from './router/Router';

const App = () => (
    <MantineProvider>
        <RouterProvider router={router} />
    </MantineProvider>
);

export default App;
