import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { useNavigate, useParams } from 'react-router-dom';

import EmptyNotification from '@/domains/notification/components/EmptyNotification';
import NotificationItem from '@/domains/notification/components/NotificationItem';
import { NOTIFICATION_TABS } from '@/domains/notification/constants';
import { useNotificationList } from '@/domains/notification/hooks/queries';
import { Notification } from '@/domains/notification/types';
import Header from '@/shared/components/common/Header';
import Indicator from '@/shared/components/common/Spinner/Indicator';
import TabNavigation from '@/shared/components/common/Tab/TabNavigation';
import { ROUTES } from '@/shared/constants/route';
import { MESSAGE } from '@/shared/constants/ui';
import { useToastStore } from '@/shared/stores/useToastStore';

const NotificationPage = () => {
    const [activeTab, setActiveTab] = useState(NOTIFICATION_TABS[0].id);

    const showToast = useToastStore((state) => state.showToast);

    const navigate = useNavigate();
    const { userId } = useParams();

    const { data: result, isLoading } = useNotificationList(Number(userId));

    useEffect(() => {
        if (result && !result.success) {
            navigate(ROUTES.PATH.MAIN);
            showToast(result.error || MESSAGE.ERROR.UNKNOWN);
        }
    }, [result]);

    // TODO: 안내 알림 추가 시, 각 API 요청으로 로직 변경
    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
    };

    if (!result || !result.success) return null;

    const notifications = [...result.data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const hasNotifications = notifications.length > 0;

    return (
        <div css={page}>
            <Header title={'알림'} isBackButton onBack={() => navigate(ROUTES.PATH.MAIN)} />
            <TabNavigation tabs={NOTIFICATION_TABS} activeTab={activeTab} onActiveChange={handleTabChange} />

            {isLoading ? (
                <Indicator text='알림 불러오는 중...' />
            ) : (
                <div css={content}>
                    {/* TODO: 안내 알림 추가 시, 각 API 요청으로 로직 변경 */}
                    {activeTab === 'notice' ? (
                        <EmptyNotification />
                    ) : hasNotifications ? (
                        notifications.map((item: Notification) => (
                            <NotificationItem key={item.notificationId} notificationInfo={item} />
                        ))
                    ) : (
                        <EmptyNotification />
                    )}
                </div>
            )}
        </div>
    );
};

const page = css`
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    background-color: #f9fafb;
`;

const content = css`
    flex: 1;
    overflow-y: auto;
`;

export default NotificationPage;
