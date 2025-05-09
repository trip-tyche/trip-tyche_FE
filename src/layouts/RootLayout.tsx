import { useEffect } from 'react';

import { css } from '@emotion/react';
import { Outlet } from 'react-router-dom';

import useUserStore from '@/domains/user/stores/useUserStore';
import { socket } from '@/libs/socket';
import Toast from '@/shared/components/common/Toast';
import theme from '@/shared/styles/theme';

const RootLayout = () => {
    const { userInfo } = useUserStore();
    const { connect, disconnect, isConnected } = socket;

    useEffect(() => {
        const checkConnetion = () => {
            if (!isConnected && userInfo?.userId) {
                connect(String(userInfo?.userId));
            }
        };

        const interval = setInterval(checkConnetion, 5000);

        return () => {
            clearInterval(interval);
            disconnect();
        };
    }, [userInfo?.userId, isConnected, connect, disconnect]);

    return (
        <div css={container}>
            <Outlet />
            <Toast />
        </div>
    );
};

const container = css`
    max-width: 428px;
    height: 100dvh;
    margin: 0 auto;
    background-color: ${theme.COLORS.BACKGROUND.WHITE};
`;

export default RootLayout;
