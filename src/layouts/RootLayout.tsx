import { css } from '@emotion/react';
import { Outlet } from 'react-router-dom';

import Navbar from '@/components/layout/Navbar';
import theme from '@/styles/theme';

const RootLayout = () => (
    <div css={wrapperStyle}>
        <main>
            <Outlet />
        </main>
        <Navbar />
    </div>
);
const wrapperStyle = css`
    max-width: 498px;
    min-height: 100vh;
    margin: 0 auto;

    background-color: ${theme.colors.white};
`;

export default RootLayout;
