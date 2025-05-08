import { css } from '@emotion/react';

import { COLORS } from '@/shared/constants/theme';

export const getMessageByType = (message: string, sender: string) => {
    if (!message) return;

    switch (message) {
        case 'SHARED_REQUEST':
            return <p css={notificationMessage}>{`${sender}님이 여행 티켓을 공유했습니다`}</p>;
        case 'SHARED_APPROVE':
            return <p css={notificationMessage}>{`${sender}님이 여행 초대를 수락했습니다`}</p>;
        case 'SHARED_REJECTED':
            return <p css={notificationMessage}>{`${sender}님이 여행 초대를 거절했습니다`}</p>;
        default:
            return <p css={notificationMessage}>{`${sender}님이 알림을 보냈습니다`}</p>;
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
