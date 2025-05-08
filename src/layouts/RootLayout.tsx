import { css } from '@emotion/react';
import { Outlet } from 'react-router-dom';

import Toast from '@/shared/components/common/Toast';
import theme from '@/shared/styles/theme';

const RootLayout = () => (
    <div css={container}>
        <Outlet />
        <Toast />
    </div>
);

const container = css`
    max-width: 428px;
    height: 100dvh;
    margin: 0 auto;
    background-color: ${theme.COLORS.BACKGROUND.WHITE};
`;

export default RootLayout;
