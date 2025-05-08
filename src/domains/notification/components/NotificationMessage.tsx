import { css } from '@emotion/react';

const NotificationMessage = ({ message, sender }: { message: string; sender: string }) => {
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

const notificationMessage = css`
    margin: 10px 0;
    font-size: 14px;
`;

export default NotificationMessage;
