import { useState } from 'react';

import { css } from '@emotion/react';
import { CircleAlert, CheckCircle } from 'lucide-react';

import { shareAPI } from '@/api/trips/share';
import ConfirmModal from '@/components/features/guide/ConfirmModal';
import { COLORS } from '@/constants/theme';
import { useToastStore } from '@/stores/useToastStore';
import { formatDateTime } from '@/utils/date';

interface Notification {
    notificationId: number;
    shareId: number;
    message: string;
    status: string;
    createdAt: string;
}

interface NotificationProps {
    notification: Notification;
    onClick?: () => void;
}

interface SharedTripDetail {
    ownerNickname: string;
    shareId: number;
    status: string;
    tripId: number;
    tripTitle: string;
}

const Notification = ({ notification }: NotificationProps) => {
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [sharedTripDetail, setSharedTripDetail] = useState<SharedTripDetail>();

    const showToast = useToastStore((state) => state.showToast);

    const getNotificationStyle = (type: string) => {
        return type === 'SHARED_REQUEST'
            ? css`
                  border-left: 4px solid ${COLORS.PRIMARY};
                  background-color: ${`${COLORS.PRIMARY}0.03`};
              `
            : css`
                  border-left: 4px solid ${COLORS.TEXT.DESCRIPTION_LIGHT};
                  background-color: ${`${COLORS.TEXT.DESCRIPTION_LIGHT}0.03`};
              `;
    };

    const getReadStatus = (status: string) => {
        return status === 'UNREAD'
            ? css`
                  background-color: white;
                  font-weight: 500;
              `
            : css`
                  background-color: ${COLORS.BACKGROUND};
                  color: ${COLORS.TEXT.DESCRIPTION};
              `;
    };

    const handleDetailShow = async () => {
        if (notification.message === 'SHARED_APPROVE' && notification.status === 'READ') return;

        await shareAPI.updateNotificationStatus(String(notification.notificationId));

        if (notification.shareId) {
            const response = await shareAPI.getShareDetail(String(notification.shareId));
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
        await shareAPI.updateShareStatus(String(notification.shareId), 'APPROVED');
        setIsDetailOpen(false);
        showToast('여행 공유가 수락되었습니다');
    };

    const handleShareReject = async () => {
        await shareAPI.updateShareStatus(String(notification.shareId), 'REJECTED');
        setIsDetailOpen(false);
        showToast('여행 공유가 거절되었습니다');
    };

    const message =
        notification.message === 'SHARED_REQUEST'
            ? '새로운 여행 공유 요청이 도착했습니다'
            : '상대방이 여행 공유 요청을 확인했습니다';
    return (
        <>
            <div
                key={notification.notificationId}
                css={[
                    notificationStyle,
                    getNotificationStyle(notification.message),
                    getReadStatus(notification.status),
                    (notification.status === 'UNREAD' || notification.message === 'SHARED_REQUEST') &&
                        unReadNotificationStyle,
                ]}
                onClick={handleDetailShow}
            >
                <div css={messageContainer}>
                    {notification.message === 'SHARED_REQUEST' ? (
                        <CircleAlert css={icon} />
                    ) : (
                        <CheckCircle css={icon} />
                    )}
                    <p css={text}>{message}</p>
                    {notification.status === 'UNREAD' && <span css={unreadDot} />}
                </div>
                <p css={createdAt}>{formatDateTime(notification.createdAt).slice(0, 13)}</p>
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

const notificationStyle = css`
    margin-bottom: 10px;
    padding: 20px 16px;
    position: relative;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
`;

const unReadNotificationStyle = css`
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
`;

const messageContainer = css`
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
`;

const icon = css`
    width: 20px;
    height: 20px;
    color: ${COLORS.PRIMARY};
`;

const unreadDot = css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${COLORS.PRIMARY};
    margin-left: auto;
`;

const text = css`
    font-weight: 400;
    transition: color 0.2s ease;
    font-size: 14px;
    line-height: 1.5;
`;

const createdAt = css`
    position: absolute;
    bottom: 8px;
    right: 8px;
    display: flex;
    justify-content: end;
    align-items: center;
    font-size: 12px;
    font-weight: 500;
    color: ${COLORS.TEXT.DESCRIPTION};
`;

export default Notification;
