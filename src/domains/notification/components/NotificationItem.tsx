import { useState } from 'react';

import { css } from '@emotion/react';
import { Clock } from 'lucide-react';
import { GoKebabHorizontal } from 'react-icons/go';

import NotificationMessage from '@/domains/notification/components/NotificationMessage';
import { useNotificationDelete, useNotificationStatus } from '@/domains/notification/hooks/mutations';
import { Notification } from '@/domains/notification/types';
import ShareNotification from '@/domains/share/components/ShareNotification';
import { useShareStatus } from '@/domains/share/hooks/mutations';
import { useShareDetail } from '@/domains/share/hooks/queries';
import { ShareStatus } from '@/domains/share/types';
import { formatKoreanDate, formatKoreanTime } from '@/libs/utils/date';
import Avatar from '@/shared/components/Avatar';
import Badge from '@/shared/components/Badge';
import Spinner from '@/shared/components/common/Spinner';
import ConfirmModal from '@/shared/components/guide/ConfirmModal';
import { COLORS } from '@/shared/constants/theme';
import { MESSAGE } from '@/shared/constants/ui';
import { useToastStore } from '@/shared/stores/useToastStore';

interface NotificationProps {
    notificationInfo: Notification;
}

const NotificationItem = ({ notificationInfo }: NotificationProps) => {
    const { notificationId, referenceId, message, status, senderNickname, createdAt } = notificationInfo;

    const [isShowNotificationContent, setIsShowNotificationContent] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const showToast = useToastStore((state) => state.showToast);

    const { data: shareDetailResult, isLoading, error } = useShareDetail(referenceId, isShowNotificationContent);
    const { mutateAsync: updateNotificationReadStatus } = useNotificationStatus();
    const { mutateAsync: updateShareStatus, isPending: isSubmitting } = useShareStatus();
    const { mutateAsync: deleteNotificationAsync } = useNotificationDelete();

    const showNotificationContent = async () => {
        if (!isRead) {
            const result = await updateNotificationReadStatus(notificationId);
            if (!result.success) showToast(result.error);
        }
        setIsShowNotificationContent(true);
    };

    const deleteNotification = async () => {
        if (!isRead) {
            const result = await updateNotificationReadStatus(notificationId);
            if (!result.success) {
                showToast(result.error);
                return;
            }
        }

        const result = await deleteNotificationAsync([notificationId]);
        if (result.success) {
            showToast('알림이 삭제되었습니다');
        } else {
            showToast(result.error);
        }
        setIsDeleteModalOpen(false);
    };

    const handleShareStatusChange = async (status: ShareStatus) => {
        const result = await updateShareStatus({ shareId: referenceId, status });

        const approve = status === 'APPROVED';
        showToast(result.success ? (approve ? '여행 메이트가 되었어요! 🎉' : '다음에 함께 여행해요 ✈️') : result.error);
        setIsShowNotificationContent(false);
    };

    const handleNotificationDelete = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        setIsDeleteModalOpen(true);
    };

    const closeNotificationContent = () => {
        setIsShowNotificationContent(false);
    };

    const date = formatKoreanDate(createdAt);
    const time = formatKoreanTime(createdAt);
    const isRead = status === 'READ';
    const sharedTripInfo = shareDetailResult?.success && shareDetailResult?.data ? shareDetailResult?.data : null;

    if (error) {
        showToast(error ? error.message : MESSAGE.ERROR.UNKNOWN);
    }

    return (
        <>
            {isLoading && <Spinner text='알림 내용 불러오는 중...' />}

            <div css={container(isRead)} onClick={showNotificationContent}>
                <Avatar size='sm' isDot={!isRead} />
                <div css={content}>
                    <div css={header}>
                        <h3 css={sender}>{senderNickname}</h3>
                        <span css={dateText}>{date}</span>
                    </div>
                    <NotificationMessage message={message} sender={senderNickname} />
                    <div css={notificationFooter}>
                        <div css={timeContainer}>
                            <Clock size={12} color={COLORS.ICON.LIGHT} />
                            <span css={timeText}>{time}</span>
                        </div>
                        {message !== 'SHARED_REQUEST' && <Badge message={message} />}
                    </div>
                </div>

                <div css={kebabIcon} onClick={handleNotificationDelete}>
                    <GoKebabHorizontal />
                </div>
            </div>

            {isDeleteModalOpen && (
                <ConfirmModal
                    title='이 알림을 지울까요?'
                    description='지운 알림은 다시 볼 수 없어요. 괜찮으신가요?'
                    confirmText='지우기'
                    cancelText='그대로 두기'
                    confirmModal={deleteNotification}
                    closeModal={() => setIsDeleteModalOpen(false)}
                />
            )}

            {sharedTripInfo && isShowNotificationContent && (
                <ShareNotification
                    tripInfo={sharedTripInfo}
                    isSubmitting={isSubmitting}
                    onSubmit={(status: ShareStatus) => handleShareStatusChange(status)}
                    onClose={closeNotificationContent}
                />
            )}
        </>
    );
};

const container = (isRead: boolean) => css`
    padding: 16px;
    border-bottom: 1px solid ${COLORS.BORDER};
    display: flex;
    align-items: flex-start;
    background-color: ${isRead ? COLORS.BACKGROUND.WHITE : COLORS.BACKGROUND.PRIMARY};
    cursor: pointer;
    user-select: none;
`;

const content = css`
    flex: 1;
    min-width: 0;
    margin-left: 12px;
`;

const header = css`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 4px;
`;

const sender = css`
    font-weight: 500;
    color: #1f2937;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const dateText = css`
    font-size: 12px;
    color: #6b7280;
    white-space: nowrap;
    margin-left: 8px;
`;

const notificationFooter = css`
    display: flex;
    align-items: center;
    gap: 6px;
`;

const timeContainer = css`
    display: flex;
    align-items: center;
    gap: 4px;
`;

const timeText = css`
    font-size: 12px;
    color: #6b7280;
`;

const kebabIcon = css`
    margin-left: 12px;
    transform: rotate(90deg);
    cursor: pointer;
`;

export default NotificationItem;
