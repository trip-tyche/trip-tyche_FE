import { css } from '@emotion/react';
import { Outlet } from 'react-router-dom';

import Toast from '@/components/common/Toast';
import theme from '@/styles/theme';

const RootLayout = () => (
    <div css={containerStyle}>
        <main>
            <Outlet />
            <Toast />
        </main>
    </div>
);
const containerStyle = css`
    max-width: 428px;
    min-height: 100dvh;
    margin: 0 auto;
    background-color: ${theme.colors.white};
    box-shadow: ${theme.colors.boxShadowDown};
`;

export default RootLayout;
