// import { css } from '@emotion/react';
// import { BellOff } from 'lucide-react';
// import { useNavigate, useParams } from 'react-router-dom';

// import NotificationItem from '@/domains/notification/components/NotificationItem';
// import { useNotificationList } from '@/domains/notification/hooks/queries';
// import { Notification } from '@/domains/notification/types';
// import Header from '@/shared/components/common/Header';
// import Spinner from '@/shared/components/common/Spinner';
// import { ROUTES } from '@/shared/constants/paths';
// import { COLORS } from '@/shared/constants/theme';
// import { MESSAGE } from '@/shared/constants/ui';
// import { useToastStore } from '@/shared/stores/useToastStore';

// const NotificationPage = () => {
//     const showToast = useToastStore((state) => state.showToast);

//     const navigate = useNavigate();
//     const { userId } = useParams();

//     const { data: result, isLoading } = useNotificationList(Number(userId));

//     if (!result) return;
//     if (!result?.success) {
//         showToast(result ? result?.error : MESSAGE.ERROR.UNKNOWN);
//         navigate(ROUTES.PATH.MAIN);
//         return;
//     }

//     const notifications = [...result.data].sort(
//         (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
//     );
//     const hasNotifications = notifications.length > 0;

//     return (
//         <div css={container}>
//             <Header title={'알림'} isBackButton onBack={() => navigate(ROUTES.PATH.MAIN)} />

//             {isLoading ? (
//                 <Spinner />
//             ) : (
//                 <div css={content}>
//                     {hasNotifications ? (
//                         notifications.map((item: Notification) => (
//                             <NotificationItem key={item.notificationId} notificationInfo={item} />
//                         ))
//                     ) : (
//                         <div css={emptyNotification}>
//                             <div css={belloffIcon}>
//                                 <BellOff color='white' />
//                             </div>
//                             <h3 css={emptyNotificationHeading}>새로운 알림이 없습니다</h3>
//                             <p css={emptyNotificationDescription}>
//                                 {`트립티케의 다양한 알림을\n이곳에서 모아볼 수 있어요`}
//                             </p>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// const container = css`
//     height: 100dvh;
//     overflow: auto;
// `;

// const content = css`
//     height: 100%;
//     padding: 20px;
// `;

// const emptyNotification = css`
//     height: 80%;
//     display: flex;
//     flex-direction: column;
//     justify-content: center;
//     align-items: center;
// `;

// const emptyNotificationHeading = css`
//     margin-top: 18px;
//     color: #303038;
//     font-size: 18px;
//     font-weight: bold;
// `;

// const emptyNotificationDescription = css`
//     margin-top: 8px;
//     color: #767678;
//     font-size: 15px;
//     line-height: 21px;
//     text-align: center;
//     white-space: pre-line;
// `;

// const belloffIcon = css`
//     width: 48px;
//     height: 48px;
//     border-radius: 50%;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     background-color: ${COLORS.TEXT.DESCRIPTION_LIGHT};
// `;

// export default NotificationPage;

import { useState } from 'react';

import { css } from '@emotion/react';
import { BellOff, ChevronLeft, MoreVertical } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import NotificationItem from '@/domains/notification/components/NotificationItem';
import { useNotificationList } from '@/domains/notification/hooks/queries';
import { Notification } from '@/domains/notification/types';
import Header from '@/shared/components/common/Header';
import Spinner from '@/shared/components/common/Spinner';
import TabNavigation from '@/shared/components/TabNavigation';
import { ROUTES } from '@/shared/constants/paths';
import { COLORS } from '@/shared/constants/theme';
import { MESSAGE } from '@/shared/constants/ui';
import { useToastStore } from '@/shared/stores/useToastStore';

type NotifiactionType = 'all' | 'share' | 'notice';

const NotificationPage = () => {
    const [activeTab, setActiveTab] = useState('all');

    const showToast = useToastStore((state) => state.showToast);

    const navigate = useNavigate();
    const { userId } = useParams();

    const { data: result, isLoading } = useNotificationList(Number(userId));

    if (!result) return null;
    if (!result?.success) {
        showToast(result ? result?.error : MESSAGE.ERROR.UNKNOWN);
        navigate(ROUTES.PATH.MAIN);
        return null;
    }

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
    };

    const notifications = [...result.data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const hasNotifications = notifications.length > 0;

    const NOTIFICATION_TABS = [
        { id: 'all', title: '전체' },
        { id: 'share', title: '여행 공유' },
        { id: 'notice', title: '알림' },
    ];

    return (
        <div css={container}>
            <Header title={'알림'} isBackButton onBack={() => navigate(ROUTES.PATH.MAIN)} />
            <TabNavigation tabs={NOTIFICATION_TABS} activeTab={activeTab} onActiveChange={handleTabChange} />

            {isLoading ? (
                <Spinner text='알림 불러오는 중...' />
            ) : (
                <div css={contentStyle}>
                    {hasNotifications ? (
                        notifications.map((item: Notification) => (
                            <NotificationItem key={item.notificationId} notificationInfo={item} />
                        ))
                    ) : (
                        <div css={emptyNotification}>
                            <div css={belloffIcon}>
                                <BellOff color='white' />
                            </div>
                            <h3 css={emptyNotificationHeading}>새로운 알림이 없습니다</h3>
                            <p css={emptyNotificationDescription}>
                                {`트립티케의 다양한 알림을\n이곳에서 모아볼 수 있어요`}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// 기본 컨테이너
const container = css`
    height: 100dvh;
    overflow: auto;
    display: flex;
    flex-direction: column;
    background-color: #f9fafb;
`;

const contentStyle = css`
    flex: 1;
    overflow-y: auto;
`;

const emptyNotification = css`
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
    white-space: pre-line;
`;

export default NotificationPage;
