import { useEffect } from 'react';

import { css } from '@emotion/react';
import { Check, X } from 'lucide-react';

import SharedTicket from '@/domains/share/components/SharedTicket';
import { useShareStatus } from '@/domains/share/hooks/mutations';
import { useShareDetail } from '@/domains/share/hooks/queries';
import { SharedTripDetail, ShareStatus } from '@/domains/share/types';
import Avatar from '@/shared/components/common/Avatar';
import Modal from '@/shared/components/common/Modal/Modal';
import Indicator from '@/shared/components/common/Spinner/Indicator';
import { COLORS } from '@/shared/constants/style';
import { useToastStore } from '@/shared/stores/useToastStore';

interface ShareNotificationProps {
    referenceId: number;
    onClose: () => void;
}

const ShareNotification = ({ referenceId, onClose }: ShareNotificationProps) => {
    const showToast = useToastStore((state) => state.showToast);
    const { data: shareDetailResult, isLoading } = useShareDetail(referenceId);

    const { mutateAsync: updateShareStatus, isPending: isSubmitting } = useShareStatus();

    const isSuccess = !!(shareDetailResult?.success && shareDetailResult?.data);
    const tripInfo = isSuccess ? shareDetailResult.data : null;

    useEffect(() => {
        if (shareDetailResult && !shareDetailResult?.success) {
            showToast(
                shareDetailResult?.error === '공유된 여행이 없습니다.'
                    ? '이미 삭제된 여행입니다'
                    : '공유된 여행이 없습니다',
            );
            onClose();
        }
    }, [shareDetailResult, isLoading, showToast, onClose]);

    const handleShareStatusChange = async (status: ShareStatus) => {
        const result = await updateShareStatus({ shareId: referenceId, status });

        const approve = status === 'APPROVED';
        showToast(result.success ? (approve ? '여행 메이트가 되었어요! 🎉' : '다음에 함께 여행해요 ✈️') : result.error);
        onClose();
    };

    if (isLoading) {
        return <Indicator text='알림 내용 불러오는 중...' />;
    }

    if (!tripInfo) {
        return null;
    }

    const country = tripInfo.country.split('/')[1];

    return (
        <Modal closeModal={onClose} customStyle={customModalStyle}>
            <div css={header}>
                <h2 css={title}>티켓 공유 요청</h2>
                <div css={xIcon} onClick={onClose}>
                    <X />
                </div>
            </div>

            <div css={content}>
                <div css={userInfoSection}>
                    <Avatar />
                    <div css={userInfo}>
                        <h3 css={userInfoName}>{tripInfo?.ownerNickname} 님이</h3>
                        <p css={userInfoDescription}>{country} 여행에 초대합니다</p>
                    </div>
                </div>

                <p css={invitationMessage}>"함께 {country} 여행 가요! 👋"</p>

                <div css={ticketWrapper}>
                    <SharedTicket
                        userNickname={tripInfo?.ownerNickname || '알수없음'}
                        trip={tripInfo as SharedTripDetail}
                    />
                </div>

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
            </div>

            {tripInfo?.status === 'PENDING' ? (
                <div css={buttonGroup}>
                    <button css={rejectButton} onClick={() => handleShareStatusChange('REJECTED')}>
                        거절하기
                    </button>
                    <button css={acceptButton(!isSubmitting)} onClick={() => handleShareStatusChange('APPROVED')}>
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
                    <div css={backButtonWrapper}>
                        <button css={backButton} onClick={onClose}>
                            알림으로 돌아가기
                        </button>
                    </div>
                </>
            )}
        </Modal>
    );
};

const customModalStyle = css`
    overflow: hidden;
    padding: 0;
    user-select: none;
`;

const header = css`
    width: 100%;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid ${COLORS.BORDER};
`;

const title = css`
    font-size: 18px;
    font-weight: 600;
    color: ${COLORS.TEXT.BLACK};
`;

const xIcon = css`
    cursor: pointer;
`;

const content = css`
    width: 100%;
`;

const userInfoSection = css`
    padding: 16px;
    background-color: #f9fafb;
    display: flex;
    align-items: center;
`;

const userInfo = css`
    margin-left: 12px;
`;

const userInfoName = css`
    font-weight: 500;
    margin-bottom: 6px;
`;

const userInfoDescription = css`
    font-size: 14px;
    color: #6b7280;
`;

const invitationMessage = css`
    margin: 0 16px 16px;
    padding: 12px;
    background-color: ${COLORS.BACKGROUND.WHITE};
    border: 1px solid ${COLORS.BORDER};
    border-radius: 8px;
    font-style: italic;
    color: #4b5563;
`;

const ticketWrapper = css`
    padding: 0 16px;
`;

const benefitsSection = css`
    margin: 16px;
    padding: 12px;
    background-color: ${COLORS.BACKGROUND.PRIMARY};
    border-radius: 8px;
`;

const benefitsTitle = css`
    font-weight: 500;
    color: ${COLORS.PRIMARY_HOVER};
    margin-bottom: 12px;
`;

const benefitsList = css`
    list-style: none;
`;

const benefitItem = css`
    display: flex;
    align-items: flex-start;
    margin-bottom: 4px;
    color: #4b5563;
    font-size: 14px;
`;

const checkIcon = css`
    color: ${COLORS.PRIMARY};
    margin-right: 8px;
    flex-shrink: 0;
    margin-top: 2px;
`;

const buttonGroup = css`
    width: 100%;
    display: flex;
    gap: 12px;
    padding: 16px;
    border-top: 1px solid ${COLORS.BORDER};
`;

const rejectButton = css`
    flex: 1;
    height: 48px;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    background-color: white;
    color: #4b5563;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background-color: #f3f4f6;
    }
`;

const acceptButton = (isActive: boolean) => css`
    flex: 1;
    height: 48px;
    padding: 10px;
    border-radius: 8px;
    border: none;
    background-color: ${isActive ? COLORS.PRIMARY : COLORS.DISABLED};
    color: ${isActive ? 'white' : COLORS.ICON.LIGHT};
    font-weight: 500;
    cursor: ${isActive ? 'pointer' : 'not-allowed'};
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        background-color: ${isActive ? COLORS.PRIMARY_HOVER : COLORS.DISABLED};
    }
`;

const backButtonWrapper = css`
    width: 100%;
    padding: 16px;
    border-top: 1px solid ${COLORS.BORDER};
`;

const backButton = css`
    width: 100%;
    height: 48px;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    background-color: ${COLORS.BACKGROUND.WHITE};
    color: #4b5563;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background-color: #f3f4f6;
    }
`;

const shareStatusImage = css`
    position: absolute;
    width: 280px;
`;

export default ShareNotification;
