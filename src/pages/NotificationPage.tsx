import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

import { shareAPI } from '@/api/trips/share';
import Header from '@/components/common/Header';
import NotificationItem from '@/components/features/share/NotificationItem';
import { ROUTES } from '@/constants/paths';
import { Notification } from '@/types/notification';

const NotificationPage = () => {
    const [notifications, setNotifications] = useState<Notification[]>();

    const navigate = useNavigate();

    useEffect(() => {
        const getSharedTrips = async () => {
            const userId = localStorage.getItem('userId') || '';
            const result = await shareAPI.getNotifications(userId);

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
                {[...notifications]
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((item: Notification) => (
                        <NotificationItem key={item.notificationId} notification={item} />
                    ))}
            </div>
        </div>
    );
};

const container = css`
    height: 100dvh;
    overflow: auto;
`;

const content = css`
    padding: 20px;
`;

export default NotificationPage;
