import { useEffect, useState } from 'react';

import { css, keyframes } from '@emotion/react';
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
        if (!document.getElementById('outfit-font')) {
            const link = document.createElement('link');
            link.id = 'outfit-font';
            link.rel = 'stylesheet';
            link.href =
                'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap';
            document.head.appendChild(link);
        }
    }, []);

    useEffect(() => {
        if (result && !result.success) {
            navigate(ROUTES.PATH.TICKETS);
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
            <Header title="알림" isBackButton onBack={() => navigate(ROUTES.PATH.TICKETS)} />
            <TabNavigation tabs={NOTIFICATION_TABS} activeTab={activeTab} onActiveChange={handleTabChange} />

            {isLoading ? (
                <Indicator text="알림 불러오는 중..." />
            ) : (
                <div css={content}>
                    {/* TODO: 안내 알림 추가 시, 각 API 요청으로 로직 변경 */}
                    {activeTab === 'notice' ? (
                        <EmptyNotification />
                    ) : hasNotifications ? (
                        notifications.map((item: Notification, i: number) => (
                            <div key={item.notificationId} css={itemWrap(i)}>
                                <NotificationItem notificationInfo={item} />
                            </div>
                        ))
                    ) : (
                        <EmptyNotification />
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationPage;

/* ════════════════════════════════════════════
   STYLES
════════════════════════════════════════════ */

const itemEnter = keyframes`
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0);    }
`;

const page = css`
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    background: #f8fafc;
    font-family: 'Outfit', -apple-system, 'SF Pro Text', sans-serif;
`;

const content = css`
    flex: 1;
    overflow-y: auto;
`;

const itemWrap = (i: number) => css`
    animation: ${itemEnter} 0.45s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.05}s both;
`;
