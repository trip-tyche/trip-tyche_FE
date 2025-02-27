import { useState } from 'react';

import { css } from '@emotion/react';
import { TicketsPlane } from 'lucide-react';
import { GoKebabHorizontal } from 'react-icons/go';

import { shareAPI } from '@/api/trips/share';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import ConfirmModal from '@/components/features/guide/ConfirmModal';
import SharedTicket from '@/components/features/trip/SharedTicket';
import { COLORS } from '@/constants/theme';
import { useToastStore } from '@/stores/useToastStore';
import { Notification, SharedTripInfo } from '@/types/notification';
import { formatDateTime } from '@/utils/date';
import { getMessageByType, getNotificationStyle } from '@/utils/notification';

interface NotificationProps {
    notificationInfo: Notification;
}

const NotificationItem = ({ notificationInfo }: NotificationProps) => {
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [sharedTripInfo, setSharedTripInfo] = useState<SharedTripInfo>();

    const showToast = useToastStore((state) => state.showToast);

    const handleDetailShow = async () => {
        if (notificationInfo.status === 'UNREAD') {
            await shareAPI.updateNotificationStatus(String(notificationInfo.notificationId));
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
        showToast('여행 공유가 수락되었습니다');
    };

    const handleShareReject = async () => {
        await shareAPI.updateShareStatus(String(notificationInfo.referenceId), 'REJECTED');
        setIsDetailOpen(false);
        showToast('여행 공유가 거절되었습니다');
    };

    const handleDeleteClick = async (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();

        setIsDeleteModalOpen(true);
    };

    const handleNotificationRemove = async () => {
        const deletedNotification = [notificationInfo.notificationId];
        const response = await shareAPI.deleteNotification(deletedNotification);

        if (response.isSuccess) {
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
                        <p css={createdAt}>{formatDateTime(notificationInfo.createdAt).slice(6, 13)}</p>
                    </div>
                    <div css={removeIcon} onClick={handleDeleteClick}>
                        <GoKebabHorizontal />
                    </div>
                </div>
                {getMessageByType(notificationInfo.message)}
            </div>

            {isDeleteModalOpen && (
                <ConfirmModal
                    title='알림을 삭제하시겠습니까?'
                    description='알림을 삭제하면 다시 확인할 수 없어요. 그래도 삭제하시겠습니까?'
                    confirmText='삭제'
                    cancelText='취소'
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
                        {sharedTripInfo?.status === 'PENDING' && (
                            <div css={buttonGroup}>
                                <Button text={'거절하기'} variant='white' onClick={handleShareReject} />
                                <Button text={'수락하기'} onClick={handleShareApprove} />
                            </div>
                        )}
                        {sharedTripInfo?.status === 'REJECTED' && (
                            <>
                                <p css={descriptionStyle}>이미 거절된 요청입니다</p>
                                <div css={buttonGroup}>
                                    <Button
                                        text={'목록으로 돌아가기'}
                                        variant='white'
                                        onClick={() => setIsDetailOpen(false)}
                                    />
                                </div>
                            </>
                        )}
                        {sharedTripInfo?.status === 'APPROVED' && (
                            <>
                                <p css={descriptionStyle}>이미 승인된 요청입니다</p>
                                <div css={buttonGroup}>
                                    <Button
                                        text={'목록으로 돌아가기'}
                                        variant='white'
                                        onClick={() => setIsDetailOpen(false)}
                                    />
                                </div>
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

const descriptionStyle = css`
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    color: ${COLORS.TEXT.DESCRIPTION_LIGHT};
    margin-bottom: 16px;
`;

export default NotificationItem;
