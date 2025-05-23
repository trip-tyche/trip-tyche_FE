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
    const { userInfo } = useUserStore();
    const { senderNickname, description } = useModalStore();
    const { connect, disconnect } = socket;
    /** TODO: 소켓 연결 상태
     * 메인 페이지로 진입 시, 의존성 배열의 isConnected 변경으로 클린업 함수 동작
     * 콘솔에 진입 할 때마다, isConnected: true, false, true... 로그
     * 이로 인해 isConnected: false일 때, 소켓 연결이 끊기는 치명적 에러 발생
     *  */

    useEffect(() => {
        // if (!isConnected && userInfo?.userId) {
        if (userInfo?.userId) {
            connect(String(userInfo?.userId));
        }

        return () => {
            disconnect();
        };
    }, [userInfo?.userId, connect, disconnect]);

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
