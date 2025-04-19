import { ThemeProvider } from '@emotion/react';
import { MantineProvider } from '@mantine/core';
import { RouterProvider } from 'react-router-dom';

import TanStackProvider from '@/providers/TanStackProvider';
import router from '@/router/Router';
// import webSocketService from '@/services/webocketService';
import GlobalStyle from '@/styles/GlobalStyle';
import GoogleAutoCompleteStyle from '@/styles/GoogleAutoCompleteStyle';
import theme from '@/styles/theme';

import '@mantine/dates/styles.css';
import '@mantine/core/styles.css';

const App = () => {
    return (
        <TanStackProvider>
            <MantineProvider>
                <ThemeProvider theme={theme}>
                    <GlobalStyle />
                    <GoogleAutoCompleteStyle />
                    <RouterProvider router={router} />
                </ThemeProvider>
            </MantineProvider>
        </TanStackProvider>
    );
};

export default App;
