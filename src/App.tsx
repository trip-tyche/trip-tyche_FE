import { useEffect } from 'react';

import { ThemeProvider } from '@emotion/react';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';

import router from '@/router/Router';
import webSocketService from '@/services/webSocketService';
import GlobalStyle from '@/styles/GlobalStyle';
import GoogleAutoCompleteStyle from '@/styles/GoogleAutoCompleteStyle';
import theme from '@/styles/theme';

import '@mantine/dates/styles.css';
import '@mantine/core/styles.css';

const queryClient = new QueryClient();

const App = () => {
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            webSocketService.connect(userId);
        }

        // 앱 종료 시 연결 해제
        return () => {
            webSocketService.disconnect();
        };
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider>
                <ThemeProvider theme={theme}>
                    <GlobalStyle />
                    <GoogleAutoCompleteStyle />
                    <RouterProvider router={router} />
                </ThemeProvider>
            </MantineProvider>
        </QueryClientProvider>
    );
};

export default App;
