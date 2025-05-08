import { css } from '@emotion/react';
import { Check } from 'lucide-react';

import SharedTicket from '@/domains/share/components/SharedTicket';
import { SharedTripDetail, ShareStatus } from '@/domains/share/types';
import Modal from '@/shared/components/common/Modal';
import { COLORS } from '@/shared/constants/theme';

interface ShareNotificationProps {
    tripInfo: SharedTripDetail;
    onSubmit: (status: ShareStatus) => void;
    onClose: () => void;
}

const ShareNotification = ({ tripInfo, onClose, onSubmit }: ShareNotificationProps) => {
    return (
        <Modal closeModal={onClose}>
            <div css={modalContent}>
                <div css={modalHeader}>
                    <h2 css={modalTitle}>티켓 공유 요청</h2>
                </div>

                <div css={userInfoSection}>
                    <div css={userAvatarContainer}>
                        <img src='/api/placeholder/40/40' alt={tripInfo.ownerNickname} css={userAvatar} />
                    </div>
                    <div>
                        <h3 css={userInfoName}>{tripInfo.ownerNickname}님이</h3>
                        <p css={userInfoDescription}>그리스 여행에 초대합니다</p>
                    </div>
                </div>

                <p css={invitationMessage}>"함께 그리스 여행 가요! 함께하면 더 즐거울 거예요 👋"</p>

                <SharedTicket userNickname={tripInfo?.ownerNickname || ''} trip={tripInfo as SharedTripDetail} />

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

                {tripInfo.status === 'PENDING' ? (
                    <div css={buttonGroup}>
                        <button css={rejectButton} onClick={() => onSubmit('REJECTED')}>
                            거절하기
                        </button>
                        <button css={acceptButton} onClick={() => onSubmit('APPROVED')}>
                            함께 여행하기
                        </button>
                    </div>
                ) : (
                    <>
                        <img
                            css={shareStatusImage}
                            src={`/passport-${tripInfo?.status === 'REJECTED' ? 'rejected' : 'approved'}.png`}
                            alt={tripInfo?.status === 'REJECTED' ? '거절됨' : '수락됨'}
                        />
                        <button css={backButton} onClick={onClose}>
                            알림으로 돌아가기
                        </button>
                    </>
                )}
            </div>
        </Modal>
    );
};

const modalContent = css`
    width: 100%;
    max-width: 400px;
    padding: 0;
    border-radius: 12px;
    overflow: hidden;
`;

const modalHeader = css`
    padding: 16px;
    border-bottom: 1px solid ${COLORS.BORDER};
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const modalTitle = css`
    font-size: 18px;
    font-weight: 600;
`;

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
    border: 1px solid ${COLORS.BORDER};
    border-radius: 8px;
    font-style: italic;
    color: #4b5563;
`;

const benefitsSection = css`
    margin: 16px;
    padding: 12px;
    background-color: ${COLORS.BACKGROUND.PRIMARY};
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

const buttonGroup = css`
    display: flex;
    gap: 12px;
    padding: 16px;
    border-top: 1px solid ${COLORS.BORDER};
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

export default ShareNotification;
