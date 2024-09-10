import { css } from '@emotion/react';
import { Outlet, useLocation } from 'react-router-dom';

import Navbar from '@/components/layout/Navbar';
import { PATH } from '@/constants/path';
import theme from '@/styles/theme';

const RootLayout = () => {
    const location = useLocation();

    const showNavbar = () => {
        const navbarPaths = [PATH.HOME, PATH.TRIPS, PATH.MYPAGE];

        return navbarPaths.some((path) => location.pathname === path);
    };

    return (
        <div css={containerStyle}>
            {showNavbar() && <Navbar />}
            <main css={mainStyle}>
                <Outlet />
            </main>
        </div>
    );
};
const containerStyle = css`
    max-width: 498px;
    min-height: 100vh;
    margin: 0 auto;
    background-color: ${theme.colors.white};
`;

const mainStyle = css`
    width: 100%;
    padding-bottom: 80px;
    /* height: calc(100vh - 80px); */
`;

export default RootLayout;
