import { useState } from 'react';

import { css } from '@emotion/react';
import { TicketsPlane } from 'lucide-react';
import { GoKebabHorizontal } from 'react-icons/go';

import { shareAPI } from '@/api';
import { notifiactionAPI } from '@/api/notification';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import ConfirmModal from '@/components/features/guide/ConfirmModal';
import SharedTicket from '@/components/features/trip/SharedTicket';
import { COLORS } from '@/constants/theme';
import { Notification, SharedTripInfo } from '@/domain/notification/types';
import { useToastStore } from '@/stores/useToastStore';
// import { Notification, SharedTripInfo } from '@/types/notification';
import { formatDateTime } from '@/utils/date';
import { getMessageByType, getNotificationStyle } from '@/utils/notification';

interface NotificationProps {
    notificationInfo: Notification;
}

const NotificationItem = ({ notificationInfo }: NotificationProps) => {
    const [sharedTripInfo, setSharedTripInfo] = useState<SharedTripInfo>();
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const showToast = useToastStore((state) => state.showToast);

    const handleDetailShow = async () => {
        if (notificationInfo.status === 'UNREAD') {
            await notifiactionAPI.updateNotificationStatus(String(notificationInfo.notificationId));
        }

        if (notificationInfo.referenceId) {
            const response = await shareAPI.getShareDetail(String(notificationInfo.referenceId));
            const sharedTripInfo = response.data;

            const tripInfo = {
                ownerNickname: sharedTripInfo.ownerNickname,
                status: sharedTripInfo.status,
                tripTitle: sharedTripInfo.tripTitle,
                country: sharedTripInfo.country,
                startDate: sharedTripInfo.startDate,
                endDate: sharedTripInfo.endDate,
                hashtags: sharedTripInfo.hashtags.split(','),
            };

            setSharedTripInfo(tripInfo);
            setIsDetailOpen(true);
        }
    };

    const handleShareApprove = async () => {
        await shareAPI.updateShareStatus(String(notificationInfo.referenceId), 'APPROVED');
        setIsDetailOpen(false);
        showToast('여행 메이트가 되었어요! 🎉');
    };

    const handleShareReject = async () => {
        await shareAPI.updateShareStatus(String(notificationInfo.referenceId), 'REJECTED');
        setIsDetailOpen(false);
        showToast('다음에 함께 여행해요 ✈️');
    };

    const handleDeleteClick = async (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();

        setIsDeleteModalOpen(true);
    };

    const handleNotificationRemove = async () => {
        const deletedNotification = [notificationInfo.notificationId];
        const response = await notifiactionAPI.deleteNotification(deletedNotification);

        if (response.success) {
            showToast('알림이 삭제되었습니다');
            setIsDeleteModalOpen(false);
        }
    };

    const isRead = notificationInfo.status === 'READ';

    return (
        <>
            <div
                key={notificationInfo.notificationId}
                css={[container, getNotificationStyle(isRead)]}
                onClick={handleDetailShow}
            >
                <div css={info}>
                    <div css={notification}>
                        <div css={ticketIcon}>
                            <TicketsPlane size={18} color={COLORS.PRIMARY} />
                        </div>
                        <p css={sender}>{notificationInfo.senderNickname}</p>
                        <p css={createdAt}>{formatDateTime(notificationInfo.createdAt, false)}</p>
                    </div>
                    <div css={removeIcon} onClick={handleDeleteClick}>
                        <GoKebabHorizontal />
                    </div>
                </div>
                {getMessageByType(notificationInfo.message)}
            </div>

            {isDeleteModalOpen && (
                <ConfirmModal
                    title='이 알림을 지울까요?'
                    description='지운 알림은 다시 볼 수 없어요. 괜찮으신가요?'
                    confirmText='지우기'
                    cancelText='그대로 두기'
                    confirmModal={handleNotificationRemove}
                    closeModal={() => setIsDeleteModalOpen(false)}
                />
            )}

            {isDetailOpen && (
                <Modal closeModal={() => setIsDetailOpen(false)}>
                    <div css={sharedTripInfoStyle}>
                        <SharedTicket
                            userNickname={sharedTripInfo?.ownerNickname || ''}
                            trip={sharedTripInfo as SharedTripInfo}
                        />
                        {sharedTripInfo?.status === 'PENDING' ? (
                            <div css={buttonGroup}>
                                <Button text={'거절하기'} variant='white' onClick={handleShareReject} />
                                <Button text={'함께 여행하기'} onClick={handleShareApprove} />
                            </div>
                        ) : (
                            <>
                                <img
                                    css={shareStatusStyle}
                                    src={`/passport-${sharedTripInfo?.status === 'REJECTED' ? 'rejected' : 'approved'}.png`}
                                />
                                <Button
                                    text={'알림으로 돌아가기'}
                                    variant='white'
                                    onClick={() => setIsDetailOpen(false)}
                                />
                            </>
                        )}
                    </div>
                </Modal>
            )}
        </>
    );
};

const container = css`
    margin-bottom: 16px;
    padding: 15px 16px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    background-color: ${COLORS.BACKGROUND.WHITE};
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    cursor: pointer;
`;

const info = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const notification = css`
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

const sharedTripInfoStyle = css`
    width: 100%;
    padding: 8px;
`;

const buttonGroup = css`
    display: flex;
    margin-bottom: 4px;
    gap: 8px;
`;

const shareStatusStyle = css`
    position: absolute;
    width: 200px;
    bottom: 100px;
    left: 90px;
`;

export default NotificationItem;
