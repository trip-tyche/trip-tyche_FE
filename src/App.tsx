import { ThemeProvider } from '@emotion/react';
import { MantineProvider } from '@mantine/core';
import { RouterProvider } from 'react-router-dom';

import router from '@/router/Router';
import GlobalStyle from '@/styles/GlobalStyle';
import GoogleAutoCompleteStyle from '@/styles/GoogleAutoCompleteStyle';
import theme from '@/styles/theme';

import '@mantine/dates/styles.css';
import '@mantine/core/styles.css';

const App = () => (
    <ThemeProvider theme={theme}>
        <GlobalStyle />
        <GoogleAutoCompleteStyle />
        <MantineProvider>
            <RouterProvider router={router} />
        </MantineProvider>
    </ThemeProvider>
);

export default App;
