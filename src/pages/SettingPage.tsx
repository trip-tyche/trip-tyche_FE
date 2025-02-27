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
import { LOGOUT_MODAL, NICKNAME_FORM } from '@/constants/ui/message';
import useAuthStore from '@/stores/useAuthStore';
import { useModalStore } from '@/stores/useModalStore';
import useUserDataStore from '@/stores/useUserDataStore';
import theme from '@/styles/theme';

const SettingPage = () => {
    const [isEditing, setIsEditing] = useState(false);

    const setLogout = useAuthStore((state) => state.setLogout);
    const userNickName = useUserDataStore((state) => state.userNickName) || '';
    const { isModalOpen, openModal, closeModal } = useModalStore();

    const navigate = useNavigate();

    const handleNicknameEdit = () => setIsEditing(true);
    const handleContact = () => console.log('문의하기');
    const handleLogout = () => openModal();

    const navigateBeforePage = () => (isEditing ? setIsEditing(false) : navigate(ROUTES.PATH.MAIN));

    const confirmLogoutModal = () => {
        closeModal();
        setLogout();
        navigate(ROUTES.PATH.AUTH.LOGIN);
    };

    const settingButtons = [
        {
            text: '닉네임 수정',
            icon: <User size={20} color={theme.COLORS.TEXT.BLACK} />,
            handleButtonClick: handleNicknameEdit,
        },
        {
            text: '문의하기',
            icon: <MessageCircle size={20} color={theme.COLORS.TEXT.BLACK} />,
            handleButtonClick: handleContact,
        },
    ];

    return (
        <div css={pageContainer}>
            <Header title={isEditing ? '닉네임 변경' : '설정'} isBackButton onBack={navigateBeforePage} />
            {isEditing ? (
                <NickNameForm
                    mode='edit'
                    title={NICKNAME_FORM.TITLE}
                    buttonText='변경 완료'
                    placeholder={userNickName}
                    setIsEditing={setIsEditing}
                />
            ) : (
                <main css={mainStyle}>
                    <div css={userInfoContainer}>
                        <img css={characterStyle} src={character} alt='캐릭터' />
                        <p css={nickNameWrapper}>
                            여행자,<span css={nickNameStyle}>{userNickName}</span>
                        </p>
                    </div>

                    <div css={buttonGroup}>
                        <div css={optionList}>
                            {settingButtons.map((button, index) => (
                                <SettingButton
                                    key={index}
                                    text={button.text}
                                    icon={button.icon}
                                    onClick={button.handleButtonClick}
                                />
                            ))}
                        </div>
                        <SettingButton
                            text='로그아웃'
                            icon={<LogOut size={20} color={theme.COLORS.TEXT.BLACK} />}
                            onClick={handleLogout}
                        />
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
    height: calc(100% - 44px);
    padding: 20px;
`;

const userInfoContainer = css`
    height: 38px;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 18px;
    font-size: ${theme.FONT_SIZES.XL};
`;

const characterStyle = css`
    width: 30px;
    height: auto;
`;

const nickNameWrapper = css`
    align-self: flex-end;
    margin-bottom: 2px;
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

const buttonGroup = css`
    height: calc(100% - 54px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const optionList = css`
    display: flex;
    flex-direction: column;
`;

export default SettingPage;
