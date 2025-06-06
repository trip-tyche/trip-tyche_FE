import { css } from '@emotion/react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useShareModalStore } from '@/domains/share/stores/useShareModalStore';
import useUserStore from '@/domains/user/stores/useUserStore';
import Avatar from '@/shared/components/common/Avatar';
import Modal from '@/shared/components/common/Modal/Modal';
import { ROUTES } from '@/shared/constants/route';
import { COLORS } from '@/shared/constants/style';

interface GlobalShareModalProps {
    senderNickname: string;
    description: string;
}

const GlobalShareModal = ({ senderNickname, description }: GlobalShareModalProps) => {
    const { userInfo } = useUserStore();
    const { isModalOpen, closeModal } = useShareModalStore();

    const navigate = useNavigate();

    if (!userInfo || !isModalOpen) return null;

    return (
        <Modal customStyle={customModalStyle}>
            <div css={header}>
                <h2 css={title}>티켓 공유 요청</h2>
                <div css={xIcon} onClick={() => closeModal()}>
                    <X />
                </div>
            </div>

            <div css={content}>
                <div css={userInfoSection}>
                    <Avatar />
                    <div css={userInfoStyle}>
                        <h3 css={userInfoName}>{senderNickname} 님이</h3>
                        <p css={userInfoDescription}>{description}</p>
                    </div>
                </div>

                <p css={invitationMessage}>"함께 여행을 추억해요! 👋"</p>
            </div>

            <div css={backButtonWrapper}>
                <button
                    css={backButton}
                    onClick={() => {
                        closeModal();
                        navigate(ROUTES.PATH.NOTIFICATION(userInfo?.userId));
                    }}
                >
                    지금 바로 확인하기
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

const userInfoStyle = css`
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

export default GlobalShareModal;
