// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { userAPI } from '@/libs/apis';
import { toResult } from '@/libs/apis/shared/utils';
import { queryClient } from '@/shared/providers/TanStackProvider';

// React 마운트 이전 summary 페치 시작 (소켓 연결 지연 최소화)
queryClient.prefetchQuery({
    queryKey: ['summary'],
    queryFn: () => toResult(() => userAPI.fetchUserInfo()),
});

createRoot(document.getElementById('root')!).render(
    // <StrictMode>
    <App />,
    // </StrictMode>
);
