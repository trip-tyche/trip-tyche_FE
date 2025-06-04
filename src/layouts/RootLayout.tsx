import { useEffect } from 'react';

import { css } from '@emotion/react';
import { Outlet } from 'react-router-dom';

import GlobalShareModal from '@/domains/share/components/GlobalShareModal';
import useUserStore from '@/domains/user/stores/useUserStore';
import { socket } from '@/libs/socket';
import Toast from '@/shared/components/common/Toast';
import { useModalStore } from '@/shared/stores/useModalStore';
import theme from '@/shared/styles/theme';

const RootLayout = () => {
    const userId = useUserStore((state) => state.userInfo?.userId);
    const { senderNickname, description } = useModalStore();
    const { connect, disconnect } = socket;

    useEffect(() => {
        if (userId) {
            connect(String(userId));
        }

        return () => {
            disconnect();
        };
    }, [userId, connect, disconnect]);

    return (
        <div css={container}>
            <Outlet />
            <Toast />
            <GlobalShareModal senderNickname={senderNickname} description={description} />
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
