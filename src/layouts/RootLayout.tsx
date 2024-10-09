import { css } from '@emotion/react';
import { Outlet } from 'react-router-dom';

// import Navbar from '@/components/layout/Navbar';
// import { PATH } from '@/constants/path';
import theme from '@/styles/theme';

const RootLayout = () => (
    // const location = useLocation();

    // const showNavbar = () => {
    //     const navbarPaths = [PATH.TRIP_LIST, PATH.MYPAGE];

    //     return navbarPaths.some((path) => location.pathname === path);
    // };

    <div css={containerStyle}>
        {/* {showNavbar() && <Navbar />} */}
        <main>
            <Outlet />
        </main>
    </div>
);
const containerStyle = css`
    max-width: 428px;
    min-height: 100vh;
    margin: 0 auto;
    background-color: ${theme.colors.white};
    box-shadow: ${theme.colors.boxShadowDown};
`;

export default RootLayout;
