import { useState } from 'react';

import { css } from '@emotion/react';
import { Clock, Share2, X, Check, User, Calendar, MapPin, Heart, MessageCircle } from 'lucide-react';
import { GoKebabHorizontal } from 'react-icons/go';

import { useNotificationDelete, useNotificationStatus } from '@/domains/notification/hooks/mutations';
import { Notification } from '@/domains/notification/types';
import SharedTicket from '@/domains/share/components/SharedTicket';
import { useShareStatus } from '@/domains/share/hooks/mutations';
import { useShareDetail } from '@/domains/share/hooks/queries';
import { SharedTripDetail, ShareStatus } from '@/domains/share/types';
import { formatDateTime } from '@/libs/utils/date';
import { getMessageByType, getNotificationStyle } from '@/libs/utils/notification';
import Button from '@/shared/components/common/Button';
import Modal from '@/shared/components/common/Modal';
import Spinner from '@/shared/components/common/Spinner';
import ConfirmModal from '@/shared/components/guide/ConfirmModal';
import { COLORS } from '@/shared/constants/theme';
import { MESSAGE } from '@/shared/constants/ui';
import { useToastStore } from '@/shared/stores/useToastStore';

interface NotificationProps {
    notificationInfo: Notification;
}

const NotificationItem = ({ notificationInfo }: NotificationProps) => {
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const showToast = useToastStore((state) => state.showToast);

    const { notificationId, referenceId, message, status, senderNickname, createdAt } = notificationInfo;
    const { data: shareDetailResult, isLoading, error } = useShareDetail(referenceId, isDetailOpen);
    const { mutateAsync: notificationMutateAsync } = useNotificationStatus();
    const { mutateAsync: shareMutateAsync } = useShareStatus();
    const { mutateAsync: deleteMutateAsync } = useNotificationDelete();

    const showSharedTripDetail = async () => {
        const isRead = status === 'READ';

        if (!isRead) {
            const result = await notificationMutateAsync(notificationId);
            if (!result.success) throw Error(result.error);
        }
        setIsDetailOpen(true);
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

    const handleDeleteButtonClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        setIsDeleteModalOpen(true);
    };

    const isRead = status === 'READ';
    const sharedTripInfo = shareDetailResult?.success && shareDetailResult?.data ? shareDetailResult?.data : null;
    const readStatus = isRead ? 'read' : 'unread';

    if (error) {
        showToast(error ? error.message : MESSAGE.ERROR.UNKNOWN);
    }

    // 알림 유형에 따른 메시지와 상태 배지
    const getNotificationContent = () => {
        let destination = '';
        let type = '';

        // 메시지 분석 (간단한 예시)
        if (message.includes('공유')) {
            type = 'share_request';
            destination = message.split(' ')[0]; // 단순화된 예시
        } else if (message.includes('수락')) {
            type = 'share_accepted';
            destination = message.split(' ')[0]; // 단순화된 예시
        } else if (message.includes('거절')) {
            type = 'share_rejected';
            destination = message.split(' ')[0]; // 단순화된 예시
        }

        return { type, destination };
    };

    const { type, destination } = getNotificationContent();
    const formattedDate = formatDateTime(createdAt, false);
    const dateParts = formattedDate.split(' ');
    const date = dateParts[0]; // 날짜 부분 추출
    const time = dateParts[1]; // 시간 부분 추출

    return (
        <>
            {isLoading && <Spinner />}

            <div css={[notificationItemContainer, isRead ? readStyle : unreadStyle]} onClick={showSharedTripDetail}>
                <div css={avatarContainer}>
                    <img src='/api/placeholder/40/40' alt={senderNickname} css={avatarImage} />
                    {!isRead && <div css={unreadIndicator}></div>}
                </div>

                <div css={notificationContent}>
                    <div css={notificationHeader}>
                        <h3 css={senderName}>{senderNickname}</h3>
                        <span css={dateText}>{date}</span>
                    </div>

                    <p css={messageText}>
                        {type === 'share_request' && (
                            <>
                                <span css={destinationHighlight}>{destination}</span>
                                <span> 여행 티켓을 공유했습니다</span>
                            </>
                        )}
                        {type === 'share_accepted' && (
                            <>
                                <span>{senderNickname}님이 </span>
                                <span css={destinationHighlight}>{destination}</span>
                                <span> 여행 초대를 수락했습니다</span>
                            </>
                        )}
                        {type === 'share_rejected' && (
                            <>
                                <span>{senderNickname}님이 </span>
                                <span css={destinationHighlight}>{destination}</span>
                                <span> 여행 초대를 거절했습니다</span>
                            </>
                        )}
                        {(!type || !type.includes('share')) && getMessageByType(message)}
                    </p>

                    <div css={notificationFooter}>
                        <div css={timeContainer}>
                            <Clock size={12} css={clockIcon} />
                            <span css={timeText}>{time}</span>
                        </div>

                        {type === 'share_accepted' && <span css={acceptedBadge}>수락됨</span>}
                        {type === 'share_rejected' && <span css={rejectedBadge}>거절됨</span>}
                    </div>
                </div>

                <div css={actionContainer}>
                    <div css={shareIcon}>
                        <Share2 size={20} color='#9CA3AF' />
                    </div>
                    <div css={kebabIcon} onClick={handleDeleteButtonClick}>
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

            {sharedTripInfo && isDetailOpen && (
                <Modal closeModal={() => setIsDetailOpen(false)}>
                    <div css={modalContent}>
                        <div css={modalHeader}>
                            <h2 css={modalTitle}>티켓 공유 요청</h2>
                            <button css={closeButton} onClick={() => setIsDetailOpen(false)}>
                                <X size={24} color='#6B7280' />
                            </button>
                        </div>

                        <div css={userInfoSection}>
                            <div css={userAvatarContainer}>
                                <img src='/api/placeholder/40/40' alt={sharedTripInfo.ownerNickname} css={userAvatar} />
                            </div>
                            <div>
                                <h3 css={userInfoName}>{sharedTripInfo.ownerNickname}님이</h3>
                                <p css={userInfoDescription}>{destination} 여행에 초대합니다</p>
                            </div>
                        </div>

                        <p css={invitationMessage}>"함께 {destination} 여행 가요! 함께하면 더 즐거울 거예요 👋"</p>

                        <SharedTicket
                            userNickname={sharedTripInfo?.ownerNickname || ''}
                            trip={sharedTripInfo as SharedTripDetail}
                        />

                        <div css={benefitsSection}>
                            <h4 css={benefitsTitle}>함께 여행하면 좋은 점</h4>
                            <ul css={benefitsList}>
                                <li css={benefitItem}>
                                    <Check size={16} css={checkIcon} />
                                    <span>같은 장소의 사진이 자동으로 공유됩니다</span>
                                </li>
                                <li css={benefitItem}>
                                    <Check size={16} css={checkIcon} />
                                    <span>함께한 여행 기록을 간직할 수 있습니다</span>
                                </li>
                                <li css={benefitItem}>
                                    <Check size={16} css={checkIcon} />
                                    <span>실시간으로 여행 위치를 공유할 수 있습니다</span>
                                </li>
                            </ul>
                        </div>

                        {sharedTripInfo.status === 'PENDING' ? (
                            <div css={buttonGroup}>
                                <button css={rejectButton} onClick={() => handleShareStatusChange('REJECTED')}>
                                    거절하기
                                </button>
                                <button css={acceptButton} onClick={() => handleShareStatusChange('APPROVED')}>
                                    함께 여행하기
                                </button>
                            </div>
                        ) : (
                            <>
                                <img
                                    css={shareStatusImage}
                                    src={`/passport-${sharedTripInfo?.status === 'REJECTED' ? 'rejected' : 'approved'}.png`}
                                    alt={sharedTripInfo?.status === 'REJECTED' ? '거절됨' : '수락됨'}
                                />
                                <button css={backButton} onClick={() => setIsDetailOpen(false)}>
                                    알림으로 돌아가기
                                </button>
                            </>
                        )}
                    </div>
                </Modal>
            )}
        </>
    );
};

// 알림 항목 스타일
const notificationItemContainer = css`
    padding: 16px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: flex-start;
`;

const readStyle = css`
    background-color: white;
`;

const unreadStyle = css`
    background-color: #eff6ff;
`;

// 아바타 관련 스타일
const avatarContainer = css`
    position: relative;
    margin-right: 12px;
`;

const avatarImage = css`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #e5e7eb;
`;

const unreadIndicator = css`
    position: absolute;
    top: -4px;
    right: -4px;
    width: 12px;
    height: 12px;
    background-color: #3b82f6;
    border-radius: 50%;
    border: 2px solid white;
`;

// 알림 컨텐츠 스타일
const notificationContent = css`
    flex: 1;
    min-width: 0;
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

const destinationHighlight = css`
    font-weight: 500;
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
    color: #9ca3af;
    margin-right: 4px;
`;

const timeText = css`
    font-size: 12px;
    color: #6b7280;
`;

const acceptedBadge = css`
    margin-left: 8px;
    padding: 2px 8px;
    background-color: #d1fae5;
    color: #065f46;
    font-size: 12px;
    border-radius: 9999px;
`;

const rejectedBadge = css`
    margin-left: 8px;
    padding: 2px 8px;
    background-color: #f3f4f6;
    color: #4b5563;
    font-size: 12px;
    border-radius: 9999px;
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

// 모달 스타일
const modalContent = css`
    width: 100%;
    max-width: 400px;
    padding: 0;
    border-radius: 12px;
    overflow: hidden;
`;

const modalHeader = css`
    padding: 16px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const modalTitle = css`
    font-size: 18px;
    font-weight: 600;
`;

const closeButton = css`
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
`;

// 사용자 정보 섹션
const userInfoSection = css`
    padding: 16px;
    background-color: #f9fafb;
    display: flex;
    align-items: center;
`;

const userAvatarContainer = css`
    margin-right: 12px;
`;

const userAvatar = css`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
`;

const userInfoName = css`
    font-weight: 500;
`;

const userInfoDescription = css`
    font-size: 14px;
    color: #6b7280;
`;

const invitationMessage = css`
    margin: 0 16px 16px;
    padding: 12px;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-style: italic;
    color: #4b5563;
`;

// 혜택 섹션
const benefitsSection = css`
    margin: 16px;
    padding: 12px;
    background-color: #eff6ff;
    border-radius: 8px;
`;

const benefitsTitle = css`
    font-weight: 500;
    color: #1e40af;
    margin-bottom: 8px;
`;

const benefitsList = css`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const benefitItem = css`
    display: flex;
    align-items: flex-start;
    margin-bottom: 4px;
    color: #4b5563;
    font-size: 14px;
`;

const checkIcon = css`
    color: #2563eb;
    margin-right: 8px;
    flex-shrink: 0;
    margin-top: 2px;
`;

// 버튼 스타일
const buttonGroup = css`
    display: flex;
    gap: 12px;
    padding: 16px;
    border-top: 1px solid #e5e7eb;
`;

const rejectButton = css`
    flex: 1;
    padding: 12px;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    color: #4b5563;
    font-weight: 500;
    cursor: pointer;
`;

const acceptButton = css`
    flex: 1;
    padding: 12px;
    background: #2563eb;
    border: none;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    cursor: pointer;
`;

const backButton = css`
    width: 100%;
    padding: 12px;
    margin: 16px;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    color: #4b5563;
    font-weight: 500;
    cursor: pointer;
`;

const shareStatusImage = css`
    position: absolute;
    width: 200px;
    bottom: 100px;
    left: 90px;
`;

export default NotificationItem;
