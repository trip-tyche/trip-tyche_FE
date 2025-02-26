import { useState } from 'react';

import { css } from '@emotion/react';
import { TicketsPlane } from 'lucide-react';
import { GoKebabHorizontal } from 'react-icons/go';

import { shareAPI } from '@/api/trips/share';
import ConfirmModal from '@/components/features/guide/ConfirmModal';
import { COLORS } from '@/constants/theme';
import { useToastStore } from '@/stores/useToastStore';
import { Notification, SharedTripDetail } from '@/types/notification';
import { formatDateTime } from '@/utils/date';

interface NotificationProps {
    notification: Notification;
    onClick?: () => void;
}

const NotificationItem = ({ notification }: NotificationProps) => {
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [sharedTripDetail, setSharedTripDetail] = useState<SharedTripDetail>();

    const showToast = useToastStore((state) => state.showToast);

    const getMessageByType = (message: string) => {
        if (!message) return;

        switch (message) {
            case 'SHARED_REQUEST':
                return '새로운 티켓 공유 요청이 도착했습니다';
            case 'SHARED_APPROVE':
                return '티켓 공유 요청을 승인했어요';
            case 'SHARED_REJECTED':
                return '티켓 공유 요청을 거절했어요';
        }
    };

    const handleDetailShow = async () => {
        // if (notification.message === 'SHARED_APPROVE' && notification.status === 'READ') return;
        await shareAPI.updateNotificationStatus(String(notification.notificationId));

        if (notification.referenceId) {
            const response = await shareAPI.getShareDetail(String(notification.referenceId));
            const { status } = response.data;

            if (status === 'PENDING') {
                setSharedTripDetail(response.data);
                setIsDetailOpen(true);
            } else if (status === 'REJECTED') {
                showToast('이미 거절된 여행입니다');
            } else {
                showToast('이미 승인된 여행입니다');
            }
        }
    };

    const handleShareApprove = async () => {
        await shareAPI.updateShareStatus(String(notification.referenceId), 'APPROVED');
        setIsDetailOpen(false);
        showToast('여행 공유가 수락되었습니다');
    };

    const handleShareReject = async () => {
        await shareAPI.updateShareStatus(String(notification.referenceId), 'REJECTED');
        setIsDetailOpen(false);
        showToast('여행 공유가 거절되었습니다');
    };

    const handleNotificationRemove = async (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();

        // const deletedNotification = [notification.notificationId];
        // await shareAPI.deleteNotification(deletedNotification);
    };

    return (
        <>
            <div key={notification.notificationId} css={container(notification.status)} onClick={handleDetailShow}>
                <div css={header}>
                    <div css={notificationInfo}>
                        <div css={ticketIcon}>
                            <TicketsPlane size={18} color={COLORS.PRIMARY} />
                        </div>
                        <p css={sender}>{notification.senderNickname}</p>
                        <p css={createdAt}>{formatDateTime(notification.createdAt).slice(6, 13)}</p>
                    </div>
                    <div css={removeIcon} onClick={handleNotificationRemove}>
                        <GoKebabHorizontal />
                    </div>
                </div>

                <p css={notificationMessage}>{getMessageByType(notification.message)}</p>
            </div>

            {isDetailOpen && (
                <ConfirmModal
                    title={`'${sharedTripDetail?.tripTitle}' 여행 공유 요청`}
                    description={`${sharedTripDetail?.ownerNickname}님이 '${sharedTripDetail?.tripTitle}' 여행을 공유했습니다. 수락하시면 여행에 참여할 수 있어요.`}
                    confirmText='수락'
                    cancelText='거절'
                    confirmModal={handleShareApprove}
                    closeModal={handleShareReject}
                />
            )}
        </>
    );
};

const container = (status: string) => css`
    margin-bottom: 16px;
    padding: 15px 16px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    background-color: ${COLORS.BACKGROUND.WHITE};
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    cursor: pointer;
    color: ${status === 'READ' && COLORS.TEXT.DESCRIPTION};
    opacity: ${status === 'READ' ? 0.5 : 1};
`;

const header = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const notificationInfo = css`
    display: flex;
    align-items: center;
`;

const ticketIcon = css`
    padding-bottom: 1px;
    width: 26px;
    height: 26px;
    border: 1.5px solid ${COLORS.TEXT.DESCRIPTION}60;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const sender = css`
    margin-left: 9px;
    font-weight: bold;
    font-size: 15px;
`;

const createdAt = css`
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    color: ${COLORS.TEXT.DESCRIPTION};

    ::before {
        content: '';
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background-color: ${COLORS.TEXT.DESCRIPTION};
        margin: 0 5px;
    }
`;

const removeIcon = css`
    margin-top: -12px;
    margin-right: -12px;
    padding: 12px;
    border: 0;
    background: transparent;
    transform: rotate(90deg);
    cursor: pointer;
`;

const notificationMessage = css`
    margin-top: 10px;
    margin-left: 2px;
    font-size: 14px;
    line-height: 1.3;
`;

export default NotificationItem;
