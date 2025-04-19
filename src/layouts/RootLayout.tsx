import { css } from '@emotion/react';
import { Outlet } from 'react-router-dom';

import Toast from '@/components/common/Toast';
import theme from '@/styles/theme';

const RootLayout = () => (
    <div css={container}>
        <Outlet />
        <Toast />
    </div>
);

const container = css`
    max-width: 428px;
    min-height: 100dvh;
    margin: 0 auto;
    background-color: ${theme.COLORS.BACKGROUND.WHITE};
`;

export default RootLayout;
