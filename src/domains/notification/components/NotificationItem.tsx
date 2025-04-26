import { useState } from 'react';

import { css } from '@emotion/react';
import { TicketsPlane } from 'lucide-react';
import { GoKebabHorizontal } from 'react-icons/go';

import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Spinner from '@/components/common/Spinner';
import ConfirmModal from '@/components/guide/ConfirmModal';
import { COLORS } from '@/constants/theme';
import { MESSAGE } from '@/constants/ui';
import { useNotificationDelete, useNotificationStatus } from '@/domains/notification/hooks/mutations';
import { Notification } from '@/domains/notification/types';
import SharedTicket from '@/domains/share/components/SharedTicket';
import { useShareStatus } from '@/domains/share/hooks/mutations';
import { useShareDetail } from '@/domains/share/hooks/queries';
import { SharedTripDetail, ShareStatus } from '@/domains/share/types';
import { formatDateTime } from '@/libs/utils/date';
import { getMessageByType, getNotificationStyle } from '@/libs/utils/notification';
import { useToastStore } from '@/stores/useToastStore';

interface NotificationProps {
    notificationInfo: Notification;
}

const NotificationItem = ({ notificationInfo }: NotificationProps) => {
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const showToast = useToastStore((state) => state.showToast);

    const { notificationId, referenceId, message, status, senderNickname, createdAt } = notificationInfo;
    console.log(isDetailOpen);
    const { data: shareDetailResult, isLoading, error } = useShareDetail(referenceId, isDetailOpen);
    const { mutateAsync: notificationMutateAsync } = useNotificationStatus();
    const { mutateAsync: shareMutateAsync } = useShareStatus();
    const { mutateAsync: deleteMutateAsync } = useNotificationDelete();

    const showSharedTripDetail = async () => {
        console.log('z');
        const isRead = status === 'READ';

        if (!isRead) {
            const result = await notificationMutateAsync(referenceId);
            if (!result.success) throw Error(result.error);
        }
        console.log('3');
        setIsDetailOpen(true);
        console.log('4');
    };

    const deleteNotification = async () => {
        const result = await deleteMutateAsync([notificationId]);

        if (result.success) {
            showToast('알림이 삭제되었습니다');
            setIsDeleteModalOpen(false);
        }
    };

    const handleShareStatusChange = async (status: ShareStatus) => {
        const result = await shareMutateAsync({ shareId: referenceId, status });

        const approve = status === 'APPROVED';
        showToast(result.success ? (approve ? '여행 메이트가 되었어요! 🎉' : '다음에 함께 여행해요 ✈️') : result.error);
        setIsDetailOpen(false);
    };

    const handleDeleteButtonClick = async (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        setIsDeleteModalOpen(true);
    };

    const isRead = status === 'READ';
    const sharedTripInfo = shareDetailResult?.success && shareDetailResult?.data ? shareDetailResult?.data : null;

    if (error) {
        showToast(error ? error.message : MESSAGE.ERROR.UNKNOWN);
    }

    return (
        <>
            {isLoading && <Spinner />}
            <div key={notificationId} css={[container, getNotificationStyle(isRead)]} onClick={showSharedTripDetail}>
                <div css={info}>
                    <div css={notification}>
                        <div css={ticketIcon}>
                            <TicketsPlane size={18} color={COLORS.PRIMARY} />
                        </div>
                        <p css={sender}>{senderNickname}</p>
                        <p css={time}>{formatDateTime(createdAt, false)}</p>
                    </div>
                    <div css={removeIcon} onClick={handleDeleteButtonClick}>
                        <GoKebabHorizontal />
                    </div>
                </div>
                {getMessageByType(message)}
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

            {sharedTripInfo && isDetailOpen && (
                <Modal closeModal={() => setIsDetailOpen(false)}>
                    <div css={sharedTripInfoStyle}>
                        <SharedTicket
                            userNickname={sharedTripInfo?.ownerNickname || ''}
                            trip={sharedTripInfo as SharedTripDetail}
                        />
                        {sharedTripInfo.status === 'PENDING' ? (
                            <div css={buttonGroup}>
                                <Button
                                    text={'거절하기'}
                                    variant='white'
                                    onClick={() => handleShareStatusChange('REJECTED')}
                                />
                                <Button text={'함께 여행하기'} onClick={() => handleShareStatusChange('APPROVED')} />
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

const time = css`
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
