import { useState } from 'react';

import { css } from '@emotion/react';
import { User, MessageCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import character from '@/assets/images/character-ogami-1.png';
import Header from '@/components/common/Header';
import ConfirmModal from '@/components/features/guide/ConfirmModal';
import NickNameForm from '@/components/features/user/NickNameForm';
import SettingButton from '@/components/features/user/SettingButton';
import { ROUTES } from '@/constants/paths';
import { COLORS } from '@/constants/theme';
import { MESSAGE } from '@/constants/ui';
import { useModalStore } from '@/stores/useModalStore';
import useUserStore from '@/stores/useUserStore';
import theme from '@/styles/theme';

const SettingPage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const { isModalOpen, openModal, closeModal } = useModalStore();

    const nickname = useUserStore((state) => state.userInfo?.nickname);
    const logout = useUserStore((state) => state.logout);

    const navigate = useNavigate();

    const navigateBeforePage = () => (isEditing ? setIsEditing(false) : navigate(ROUTES.PATH.MAIN));

    const confirmLogoutModal = () => {
        closeModal();
        logout();
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
            handleButtonClick: () => console.log('문의하기'),
        },
    ];

    return (
        <div css={pageContainer}>
            <Header title={isEditing ? '닉네임 변경' : '설정'} isBackButton onBack={navigateBeforePage} />
            {isEditing ? (
                <NickNameForm mode='edit' setIsEditing={setIsEditing} />
            ) : (
                <main css={mainStyle}>
                    <div css={userInfoContainer}>
                        <img css={characterStyle} src={character} alt='캐릭터' />
                        <p css={nickNameWrapper}>
                            여행자,<span css={nickNameStyle}>{nickname}</span>
                        </p>
                    </div>

                    <ul css={optionList}>
                        {settingButtons.map((button, index) => (
                            <SettingButton
                                key={index}
                                text={button.text}
                                icon={button.icon}
                                onClick={button.handleButtonClick}
                            />
                        ))}
                    </ul>
                    <ul css={optionList}>
                        <SettingButton
                            text='로그아웃'
                            icon={<LogOut size={20} color={theme.COLORS.TEXT.BLACK} />}
                            onClick={() => openModal()}
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
                    closeModal={closeModal}
                />
            )}
        </div>
    );
};

const pageContainer = css`
    height: 100dvh;
    display: flex;
    flex-direction: column;
`;

const mainStyle = css`
    height: calc(100% - 44px);
    background-color: ${COLORS.BACKGROUND.WHITE_SECONDARY};
`;

const userInfoContainer = css`
    margin-bottom: 14px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 14px;
    font-size: ${theme.FONT_SIZES.XL};
    background-color: ${COLORS.BACKGROUND.WHITE};
    border-bottom: 1px solid rgb(233, 233, 233);
`;

const characterStyle = css`
    width: 30px;
    height: auto;
`;

const nickNameWrapper = css`
    align-self: flex-end;
    margin-bottom: 4px;
`;

const nickNameStyle = css`
    font-size: ${theme.FONT_SIZES.XL};
    font-weight: 600;
    margin-left: 4px;
    position: relative;
    display: inline-block;
    z-index: 1;

    &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 40%;
        background-color: ${theme.COLORS.PRIMARY};
        opacity: 0.3;
        border-radius: 2px;
        z-index: -1;
    }
`;

const optionList = css`
    display: flex;
    flex-direction: column;
    margin-bottom: 14px;
`;

export default SettingPage;
