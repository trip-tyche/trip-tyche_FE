import { useEffect } from 'react';

import { css } from '@emotion/react';
import { X } from 'lucide-react';

import { useNotificationDetail } from '@/domains/notification/hooks/queries';
import Avatar from '@/shared/components/common/Avatar';
import Modal from '@/shared/components/common/Modal/Modal';
import Indicator from '@/shared/components/common/Spinner/Indicator';
import { COLORS } from '@/shared/constants/style';
import { useToastStore } from '@/shared/stores/useToastStore';

interface ShareShortNotificationProps {
    message: string;
    referenceId: number;
    onClose: () => void;
}

const ShareShortNotification = ({ message, referenceId, onClose }: ShareShortNotificationProps) => {
    const showToast = useToastStore((state) => state.showToast);
    const { data: shareDetailResult, isLoading } = useNotificationDetail(referenceId);

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

    const renderDescription = () => {
        switch (message) {
            case 'TRIP_UPDATED':
                return '여행의 정보를 수정했습니다';
            case 'TRIP_DELETED':
                return '여행을 삭제했습니다';
            case 'MEDIA_FILE_ADDED':
                return '여행에 사진을 추가했습니다';
            case 'MEDIA_FILE_UPDATED':
                return '여행의 사진을 수정했습니다';
            case 'MEDIA_FILE_DELETED':
                return '여행의 사진을 삭제했습니다';
        }
    };

    if (isLoading) {
        return <Indicator text='알림 내용 불러오는 중...' />;
    }

    if (!shareDetailResult || !shareDetailResult.success) return;
    const { tripTitle, senderNickname } = shareDetailResult.data;

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
                        <h3 css={userInfoName}>{senderNickname} 님이</h3>
                        <p css={userInfoDescription}>{`${tripTitle} ${renderDescription()}`}</p>
                    </div>
                </div>
            </div>

            <div css={backButtonWrapper}>
                <button css={backButton} onClick={onClose}>
                    알림으로 돌아가기
                </button>
            </div>
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

export default ShareShortNotification;
