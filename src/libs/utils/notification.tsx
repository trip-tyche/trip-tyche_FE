import { css } from '@emotion/react';

import { COLORS } from '@/shared/constants/theme';

export const getMessageByType = (message: string) => {
    if (!message) return;

    switch (message) {
        case 'SHARED_REQUEST':
            return <p css={notificationMessage}>새로운 티켓 공유 요청이 도착했습니다</p>;
        case 'SHARED_APPROVE':
            return (
                <p css={notificationMessage}>
                    상대방이 티켓 공유 요청을 <span css={statusStyle(true)}>승인</span>했어요
                </p>
            );
        case 'SHARED_REJECTED':
            return (
                <p css={notificationMessage}>
                    상대방이 티켓 공유 요청을 <span css={statusStyle(false)}>거절</span>했어요
                </p>
            );
        default:
            return null;
    }
};

export const getNotificationStyle = (isRead: boolean) => css`
    color: ${isRead && COLORS.TEXT.DESCRIPTION};
    opacity: ${isRead ? 0.5 : 1};
`;

const notificationMessage = css`
    margin-top: 10px;
    margin-left: 2px;
    font-size: 14px;
    line-height: 1.3;
`;

const statusStyle = (isApproved: boolean) => css`
    margin: 0 2px;
    font-weight: bold;
    color: ${isApproved ? COLORS.PRIMARY : COLORS.TEXT.ERROR};
`;
