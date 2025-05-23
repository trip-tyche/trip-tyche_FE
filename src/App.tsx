import { ThemeProvider } from '@emotion/react';
import { MantineProvider } from '@mantine/core';
import { RouterProvider } from 'react-router-dom';

import router from '@/router/Router';
import TanStackProvider from '@/shared/providers/TanStackProvider';
import GlobalStyle from '@/shared/styles/GlobalStyle';
import GoogleAutoCompleteStyle from '@/shared/styles/GoogleAutoCompleteStyle';
import theme from '@/shared/styles/theme';

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
