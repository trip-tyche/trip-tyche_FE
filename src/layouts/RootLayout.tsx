import { useEffect } from 'react';

import { css } from '@emotion/react';
import { Outlet } from 'react-router-dom';

import GlobalShareModal from '@/domains/share/components/GlobalShareModal';
import { useShareModalStore } from '@/domains/share/stores/useShareModalStore';
import { useSummary } from '@/domains/user/hooks/queries';
import { socket } from '@/libs/socket';
import Toast from '@/shared/components/common/Toast';
import theme from '@/shared/styles/theme';

const RootLayout = () => {
    const { senderNickname, description } = useShareModalStore();
    const { connect, disconnect } = socket;

    const { data: summaryResult } = useSummary();
    const userId = summaryResult?.success ? summaryResult.data.userId : undefined;

    useEffect(() => {
        console.log('[RootLayout] userId effect', { userId, path: location.pathname, t: Date.now() });
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
