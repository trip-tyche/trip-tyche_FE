import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { BellOff } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { shareAPI } from '@/api';
import Header from '@/components/common/Header';
import NotificationItem from '@/components/features/notification/NotificationItem';
import { ROUTES } from '@/constants/paths';
import { COLORS } from '@/constants/theme';
import { Notification } from '@/domain/notification/types';

const NotificationPage = () => {
    const [notifications, setNotifications] = useState<Notification[]>();

    const navigate = useNavigate();
    const { userId } = useParams();

    useEffect(() => {
        const getSharedTrips = async () => {
            const result = await shareAPI.getNotifications(userId || '');
            const notifications = result.data;
            setNotifications(notifications);
        };

        getSharedTrips();
    }, []);

    if (!notifications) return;

    return (
        <div css={container}>
            <Header title={'알림'} isBackButton onBack={() => navigate(ROUTES.PATH.MAIN)} />

            <div css={content}>
                {notifications.length ? (
                    [...notifications]
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((item: Notification) => (
                            <NotificationItem key={item.notificationId} notificationInfo={item} />
                        ))
                ) : (
                    <div css={emptyNotification}>
                        <div css={belloffIcon}>
                            <BellOff color='white' />
                        </div>
                        <strong css={emptyNotificationHeading}>새로운 알림이 없습니다</strong>
                        <p css={emptyNotificationDescription}>
                            트립티케의 다양한 알림을
                            <br />
                            이곳에서 모아볼 수 있어요
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

const container = css`
    height: 100dvh;
    overflow: auto;
`;

const content = css`
    height: 100%;
    padding: 20px;
`;

const emptyNotification = css`
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const emptyNotificationHeading = css`
    margin-top: 18px;
    color: #303038;
    font-size: 18px;
    font-weight: bold;
`;

const emptyNotificationDescription = css`
    margin-top: 8px;
    color: #767678;
    font-size: 15px;
    line-height: 21px;
    text-align: center;
`;

const belloffIcon = css`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${COLORS.TEXT.DESCRIPTION_LIGHT};
`;

export default NotificationPage;
