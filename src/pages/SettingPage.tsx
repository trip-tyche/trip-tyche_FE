import { useEffect, useState } from 'react';

import { css, keyframes } from '@emotion/react';
import { User, MessageCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import character from '@/assets/images/character-icon.png';
import NickNameForm from '@/domains/user/components/NickNameForm';
import SettingButton from '@/domains/user/components/SettingButton';
import useUserStore from '@/domains/user/stores/useUserStore';
import Header from '@/shared/components/common/Header';
import ConfirmModal from '@/shared/components/common/Modal/ConfirmModal';
import { ROUTES } from '@/shared/constants/route';
import { MESSAGE } from '@/shared/constants/ui';
import theme from '@/shared/styles/theme';

const SettingPage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const nickname = useUserStore((state) => state.userInfo?.nickname);
    const logout = useUserStore((state) => state.logout);

    const navigate = useNavigate();

    useEffect(() => {
        if (!document.getElementById('outfit-font')) {
            const link = document.createElement('link');
            link.id = 'outfit-font';
            link.rel = 'stylesheet';
            link.href =
                'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap';
            document.head.appendChild(link);
        }
    }, []);

    const navigateBeforePage = () => (isEditing ? setIsEditing(false) : navigate(ROUTES.PATH.MAIN));

    const confirmLogoutModal = () => {
        setIsModalOpen(false);
        logout();
    };

    const onNicknameSubmit = () => {
        setIsEditing(false);
    };

    const settingButtons = [
        {
            text: '닉네임 수정',
            icon: <User size={20} color={theme.COLORS.TEXT.BLACK} />,
            handleButtonClick: () => setIsEditing(true),
        },
        {
            text: '문의하기',
            icon: <MessageCircle size={20} color={theme.COLORS.TEXT.BLACK} />,
            handleButtonClick: () => {},
            disabled: true,
        },
    ];

    return (
        <div css={pageContainer}>
            <Header
                title={isEditing ? '닉네임 변경' : '설정'}
                isBackButton
                onBack={navigateBeforePage}
            />

            {isEditing ? (
                <NickNameForm mode="edit" onSubmit={onNicknameSubmit} />
            ) : (
                <main css={mainStyle}>
                    {/* ── Profile card ── */}
                    <div css={profileCard}>
                        <div css={profileCardShine} aria-hidden="true" />
                        <div css={profileCardInner}>
                            <div css={avatarRing}>
                                <img css={characterImg} src={character} alt="캐릭터" />
                            </div>
                            <div css={profileText}>
                                <p css={travelerLabel}>여행자</p>
                                <p css={nicknameText}>{nickname}</p>
                            </div>
                        </div>
                    </div>

                    {/* ── Settings groups ── */}
                    <ul css={optionGroup}>
                        {settingButtons.map((button, index) => (
                            <SettingButton
                                key={index}
                                text={button.text}
                                icon={button.icon}
                                onClick={button.handleButtonClick}
                                disabled={button.disabled}
                            />
                        ))}
                    </ul>

                    <ul css={[optionGroup, optionGroupDanger]}>
                        <SettingButton
                            text="로그아웃"
                            icon={<LogOut size={20} color={theme.COLORS.TEXT.BLACK} />}
                            onClick={() => setIsModalOpen(true)}
                        />
                    </ul>
                </main>
            )}

            {isModalOpen && (
                <ConfirmModal
                    title={MESSAGE.LOGOUT_MODAL.TITLE}
                    description={MESSAGE.LOGOUT_MODAL.MESSAGE}
                    confirmText={MESSAGE.LOGOUT_MODAL.CONFIRM_TEXT}
                    cancelText={MESSAGE.LOGOUT_MODAL.CANCEL_TEXT}
                    confirmModal={confirmLogoutModal}
                    closeModal={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default SettingPage;

/* ════════════════════════════════════════════
   STYLES
════════════════════════════════════════════ */

const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0);    }
`;

const pageContainer = css`
    height: 100dvh;
    display: flex;
    flex-direction: column;
    background: #f8fafc;
    font-family: 'Outfit', -apple-system, 'SF Pro Text', sans-serif;
`;

const mainStyle = css`
    flex: 1;
    overflow: auto;
    padding: 16px 0 32px;
    animation: ${fadeUp} 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
`;

/* ── profile card ── */
const profileCard = css`
    position: relative;
    margin: 0 16px 12px;
    border-radius: 20px;
    overflow: hidden;
    background: linear-gradient(135deg, #0071e3 0%, #0055b3 100%);
    padding: 24px 20px;
    box-shadow: 0 8px 28px rgba(0, 113, 227, 0.28), 0 2px 6px rgba(0, 113, 227, 0.15);
`;

const profileCardShine = css`
    position: absolute;
    inset: 0;
    background: radial-gradient(
        ellipse at 80% 10%,
        rgba(255, 255, 255, 0.18) 0%,
        transparent 55%
    );
    pointer-events: none;
`;

const profileCardInner = css`
    position: relative;
    display: flex;
    align-items: center;
    gap: 16px;
`;

const avatarRing = css`
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.18);
    border: 1.5px solid rgba(255, 255, 255, 0.32);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`;

const characterImg = css`
    width: 34px;
    height: 34px;
    object-fit: contain;
`;

const profileText = css`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const travelerLabel = css`
    font-family: 'Outfit', sans-serif;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.65);
`;

const nicknameText = css`
    font-family: 'Outfit', sans-serif;
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.4px;
    color: #ffffff;
    line-height: 1.15;
`;

/* ── setting groups ── */
const optionGroup = css`
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border-radius: 16px;
    margin: 0 16px 8px;
    overflow: hidden;
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const optionGroupDanger = css`
    margin-top: 8px;
`;
