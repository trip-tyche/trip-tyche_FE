// import { useState } from 'react';

// import { css } from '@emotion/react';
// import { TicketsPlane } from 'lucide-react';
// import { GoKebabHorizontal } from 'react-icons/go';

// import { useNotificationDelete, useNotificationStatus } from '@/domains/notification/hooks/mutations';
// import { Notification } from '@/domains/notification/types';
// import SharedTicket from '@/domains/share/components/SharedTicket';
// import { useShareStatus } from '@/domains/share/hooks/mutations';
// import { useShareDetail } from '@/domains/share/hooks/queries';
// import { SharedTripDetail, ShareStatus } from '@/domains/share/types';
// import { formatDateTime } from '@/libs/utils/date';
// import { getMessageByType, getNotificationStyle } from '@/libs/utils/notification';
// import Button from '@/shared/components/common/Button';
// import Modal from '@/shared/components/common/Modal';
// import Spinner from '@/shared/components/common/Spinner';
// import ConfirmModal from '@/shared/components/guide/ConfirmModal';
// import { COLORS } from '@/shared/constants/theme';
// import { MESSAGE } from '@/shared/constants/ui';
// import { useToastStore } from '@/shared/stores/useToastStore';

// interface NotificationProps {
//     notificationInfo: Notification;
// }

// const NotificationItem = ({ notificationInfo }: NotificationProps) => {
//     const [isShowNotificationContent, setIsShowNotificationContent] = useState(false);
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//     const showToast = useToastStore((state) => state.showToast);

//     const { notificationId, referenceId, message, status, senderNickname, createdAt } = notificationInfo;
//     const { data: shareDetailResult, isLoading, error } = useShareDetail(referenceId, isShowNotificationContent);
//     const { mutateAsync: updateNotificationReadStatus } = useNotificationStatus();
//     const { mutateAsync: updateShareStatus } = useShareStatus();
//     const { mutateAsync: deleteNotificationAsync } = useNotificationDelete();

//     const showNotificationContent = async () => {
//         const isRead = status === 'READ';

//         if (!isRead) {
//             const result = await updateNotificationReadStatus(notificationId);
//             if (!result.success) throw Error(result.error);
//         }
//         setIsShowNotificationContent(true);
//     };

//     const deleteNotification = async () => {
//         const result = await deleteNotificationAsync([notificationId]);

//         if (result.success) {
//             showToast('알림이 삭제되었습니다');
//             setIsDeleteModalOpen(false);
//         }
//     };

//     const handleShareStatusChange = async (status: ShareStatus) => {
//         const result = await updateShareStatus({ shareId: referenceId, status });

//         const approve = status === 'APPROVED';
//         showToast(result.success ? (approve ? '여행 메이트가 되었어요! 🎉' : '다음에 함께 여행해요 ✈️') : result.error);
//         setIsShowNotificationContent(false);
//     };

//     const handleNotificationDelete = async (event: React.MouseEvent<HTMLDivElement>) => {
//         event.stopPropagation();
//         setIsDeleteModalOpen(true);
//     };

//     const isRead = status === 'READ';
//     const sharedTripInfo = shareDetailResult?.success && shareDetailResult?.data ? shareDetailResult?.data : null;

//     if (error) {
//         showToast(error ? error.message : MESSAGE.ERROR.UNKNOWN);
//     }

//     return (
//         <>
//             {isLoading && <Spinner />}
//             <div key={notificationId} css={[container, getNotificationStyle(isRead)]} onClick={showNotificationContent}>
//                 <div css={info}>
//                     <div css={notification}>
//                         <div css={ticketIcon}>
//                             <TicketsPlane size={18} color={COLORS.PRIMARY} />
//                         </div>
//                         <p css={sender}>{senderNickname}</p>
//                         <p css={time}>{formatDateTime(createdAt, false)}</p>
//                     </div>
//                     <div css={removeIcon} onClick={handleNotificationDelete}>
//                         <GoKebabHorizontal />
//                     </div>
//                 </div>
//                 {getMessageByType(message)}
//             </div>

//             {isDeleteModalOpen && (
//                 <ConfirmModal
//                     title='이 알림을 지울까요?'
//                     description='지운 알림은 다시 볼 수 없어요. 괜찮으신가요?'
//                     confirmText='지우기'
//                     cancelText='그대로 두기'
//                     confirmModal={deleteNotification}
//                     closeModal={() => setIsDeleteModalOpen(false)}
//                 />
//             )}

//             {sharedTripInfo && isShowNotificationContent && (
//                 <Modal closeModal={() => setIsShowNotificationContent(false)}>
//                     <div css={sharedTripInfoStyle}>
//                         <SharedTicket
//                             userNickname={sharedTripInfo?.ownerNickname || ''}
//                             trip={sharedTripInfo as SharedTripDetail}
//                         />
//                         {sharedTripInfo.status === 'PENDING' ? (
//                             <div css={buttonGroup}>
//                                 <Button
//                                     text={'거절하기'}
//                                     variant='white'
//                                     onClick={() => handleShareStatusChange('REJECTED')}
//                                 />
//                                 <Button text={'함께 여행하기'} onClick={() => handleShareStatusChange('APPROVED')} />
//                             </div>
//                         ) : (
//                             <>
//                                 <img
//                                     css={shareStatusStyle}
//                                     src={`/passport-${sharedTripInfo?.status === 'REJECTED' ? 'rejected' : 'approved'}.png`}
//                                 />
//                                 <Button
//                                     text={'알림으로 돌아가기'}
//                                     variant='white'
//                                     onClick={() => setIsShowNotificationContent(false)}
//                                 />
//                             </>
//                         )}
//                     </div>
//                 </Modal>
//             )}
//         </>
//     );
// };

// const container = css`
//     margin-bottom: 16px;
//     padding: 15px 16px;
//     border-radius: 12px;
//     display: flex;
//     flex-direction: column;
//     background-color: ${COLORS.BACKGROUND.WHITE};
//     box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
//     cursor: pointer;
// `;

// const info = css`
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
// `;

// const notification = css`
//     display: flex;
//     align-items: center;
// `;

// const ticketIcon = css`
//     padding-bottom: 1px;
//     width: 26px;
//     height: 26px;
//     border: 1.5px solid ${COLORS.TEXT.DESCRIPTION}60;
//     border-radius: 50%;
//     display: flex;
//     justify-content: center;
//     align-items: center;
// `;

// const sender = css`
//     margin-left: 9px;
//     font-weight: bold;
//     font-size: 15px;
// `;

// const time = css`
//     display: flex;
//     align-items: center;
//     font-size: 14px;
//     font-weight: 500;
//     color: ${COLORS.TEXT.DESCRIPTION};

//     ::before {
//         content: '';
//         width: 3px;
//         height: 3px;
//         border-radius: 50%;
//         background-color: ${COLORS.TEXT.DESCRIPTION};
//         margin: 0 5px;
//     }
// `;

// const removeIcon = css`
//     margin-top: -12px;
//     margin-right: -12px;
//     padding: 12px;
//     border: 0;
//     background: transparent;
//     transform: rotate(90deg);
//     cursor: pointer;
// `;

// const sharedTripInfoStyle = css`
//     width: 100%;
//     padding: 8px;
// `;

// const buttonGroup = css`
//     display: flex;
//     margin-bottom: 4px;
//     gap: 8px;
// `;

// const shareStatusStyle = css`
//     position: absolute;
//     width: 200px;
//     bottom: 100px;
//     left: 90px;
// `;

// export default NotificationItem;

import { useState } from 'react';

import { css } from '@emotion/react';
import { Clock, Share2 } from 'lucide-react';
import { GoKebabHorizontal } from 'react-icons/go';

import { useNotificationDelete, useNotificationStatus } from '@/domains/notification/hooks/mutations';
import { Notification } from '@/domains/notification/types';
import ShareNotification from '@/domains/share/components/ShareNotification';
import { useShareStatus } from '@/domains/share/hooks/mutations';
import { useShareDetail } from '@/domains/share/hooks/queries';
import { ShareStatus } from '@/domains/share/types';
import { formatKoreanDate, formatKoreanTime } from '@/libs/utils/date';
import { getMessageByType } from '@/libs/utils/notification';
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
    const { mutateAsync: updateShareStatus } = useShareStatus();
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
                    <div css={notificationHeader}>
                        <h3 css={senderName}>{senderNickname}</h3>
                        <span css={dateText}>{date}</span>
                    </div>

                    <p css={messageText}>{getMessageByType(message, senderNickname)}</p>

                    <div css={notificationFooter}>
                        <div css={timeContainer}>
                            <Clock size={12} css={clockIcon} />
                            <span css={timeText}>{time}</span>
                        </div>

                        {message === 'SHARED_APPROVE' && <Badge type={'SUCCESS'} />}
                        {message === 'SHARED_REJECTED' && <Badge type={'ERROR'} />}
                    </div>
                </div>

                <div css={actionContainer}>
                    <div css={shareIcon}>
                        <Share2 size={20} color={COLORS.ICON.LIGHT} />
                    </div>
                    <div css={kebabIcon} onClick={handleNotificationDelete}>
                        <GoKebabHorizontal />
                    </div>
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
    background-color: ${isRead ? COLORS.BACKGROUND.PRIMARY : COLORS.BACKGROUND.WHITE};
`;

const content = css`
    flex: 1;
    min-width: 0;
    margin-left: 12px;
`;

const notificationHeader = css`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 4px;
`;

const senderName = css`
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

const messageText = css`
    font-size: 14px;
    color: #4b5563;
    margin-bottom: 4px;
`;

const notificationFooter = css`
    display: flex;
    align-items: center;
`;

const timeContainer = css`
    display: flex;
    align-items: center;
`;

const clockIcon = css`
    color: ${COLORS.ICON.LIGHT};
    margin-right: 4px;
`;

const timeText = css`
    font-size: 12px;
    color: #6b7280;
`;

// 액션 버튼 컨테이너
const actionContainer = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 8px;
`;

const shareIcon = css`
    margin-bottom: 8px;
`;

const kebabIcon = css`
    transform: rotate(90deg);
    cursor: pointer;
`;

export default NotificationItem;
