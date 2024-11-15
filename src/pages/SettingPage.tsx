import { useState } from 'react';

import { css } from '@emotion/react';
import { User, MessageCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Header from '@/components/common/Header';
import ConfirmModal from '@/components/features/guide/ConfirmModal';
import NickNameEditor from '@/components/features/user/NickNameEditor';
import SettingButton from '@/components/features/user/SettingButton';
import { LOGOUT_MODAL } from '@/constants/message';
import { PATH } from '@/constants/path';
import useAuthStore from '@/stores/useAuthStore';
import { useModalStore } from '@/stores/useModalStore';
import theme from '@/styles/theme';

const SettingPage = () => {
    const [isEditing, setIsEditing] = useState(false);

    const setLogout = useAuthStore((state) => state.setLogout);
    const userNickName = useAuthStore((state) => state.userNickName);
    const { isModalOpen, openModal, closeModal } = useModalStore();

    const navigate = useNavigate();

    const handleNicknameEdit = () => setIsEditing(true);
    const handleContact = () => console.log('문의하기');
    const handleLogout = () => openModal();

    const navigateBeforePage = () => (isEditing ? setIsEditing(false) : navigate(PATH.MAIN));

    const confirmLogoutModal = () => {
        closeModal();
        setLogout();
        navigate(PATH.AUTH.LOGIN);
    };

    const settingButtons = [
        {
            text: '닉네임 수정',
            icon: <User size={20} color={theme.colors.black} />,
            handleButtonClick: handleNicknameEdit,
        },
        {
            text: '문의하기',
            icon: <MessageCircle size={20} color={theme.colors.black} />,
            handleButtonClick: handleContact,
        },
        {
            text: '로그아웃',
            icon: <LogOut size={20} color={theme.colors.black} />,
            handleButtonClick: handleLogout,
        },
    ];

    return (
        <div css={pageContainer}>
            <Header title={isEditing ? '닉네임 변경' : '설정'} isBackButton onBack={navigateBeforePage} />
            {isEditing ? (
                <NickNameEditor setIsEditing={setIsEditing} />
            ) : (
                <main css={mainStyle}>
                    <div css={nickNameContainer}>
                        여행자, <span css={nickNameStyle}>{userNickName}</span>
                    </div>
                    <div css={buttonGroup}>
                        {settingButtons.map((button, index) => (
                            <SettingButton
                                key={index}
                                text={button.text}
                                icon={button.icon}
                                onClick={button.handleButtonClick}
                            />
                        ))}
                    </div>
                </main>
            )}
            {isModalOpen && (
                <ConfirmModal
                    title={LOGOUT_MODAL.TITLE}
                    description={LOGOUT_MODAL.MESSAGE}
                    confirmText={LOGOUT_MODAL.CONFIRM_TEXT}
                    cancelText={LOGOUT_MODAL.CANCEL_TEXT}
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
    padding: 20px;
`;

const nickNameContainer = css`
    height: 38px;
    display: flex;
    align-items: center;
    margin-bottom: 18px;
    font-size: ${theme.fontSizes.xlarge_18};
`;

const nickNameStyle = css`
    font-size: ${theme.fontSizes.xlarge_18};
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
        height: 50%;
        background-color: ${theme.colors.primary};
        opacity: 0.4;
        border-radius: 2px;
        z-index: -1;
    }
`;

const buttonGroup = css`
    display: flex;
    flex-direction: column;
`;

export default SettingPage;
