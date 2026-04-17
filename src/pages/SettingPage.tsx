import { useState } from 'react';

import { css } from '@emotion/react';
import { User, MessageCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import character from '@/assets/images/character-icon.png';
import NickNameForm from '@/domains/user/components/NickNameForm';
import SettingButton from '@/domains/user/components/SettingButton';
import useUserStore from '@/domains/user/stores/useUserStore';
import Header from '@/shared/components/common/Header';
import ConfirmModal from '@/shared/components/common/Modal/ConfirmModal';
import { ROUTES } from '@/shared/constants/route';
import { COLORS } from '@/shared/constants/style';
import { MESSAGE } from '@/shared/constants/ui';
import theme from '@/shared/styles/theme';

const SettingPage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const nickname = useUserStore((state) => state.userInfo?.nickname);
    const logout = useUserStore((state) => state.logout);

    const navigate = useNavigate();

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
            handleButtonClick: () => console.log('문의하기'),
        },
    ];

    return (
        <div css={pageContainer}>
            <Header title={isEditing ? '닉네임 변경' : '설정'} isBackButton onBack={navigateBeforePage} />
            {isEditing ? (
                <NickNameForm mode='edit' onSubmit={onNicknameSubmit} />
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

const pageContainer = css`
    height: 100dvh;
    display: flex;
    flex-direction: column;
    background-color: #f5f5f7;
`;

const mainStyle = css`
    flex: 1;
    background-color: #f5f5f7;
    overflow: auto;
`;

const userInfoContainer = css`
    padding: 20px 16px;
    display: flex;
    align-items: center;
    gap: 14px;
    background-color: #ffffff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    margin-bottom: 8px;
`;

const characterStyle = css`
    width: 36px;
    height: auto;
`;

const nickNameWrapper = css`
    display: flex;
    align-items: baseline;
    gap: 4px;
    font-size: 17px;
    letter-spacing: -0.374px;
    color: rgba(0, 0, 0, 0.48);
`;

const nickNameStyle = css`
    font-size: 21px;
    font-weight: 600;
    letter-spacing: 0.231px;
    color: #1d1d1f;
    position: relative;
    display: inline-block;
    z-index: 1;

    &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 1px;
        width: 100%;
        height: 35%;
        background-color: #0071e3;
        opacity: 0.18;
        border-radius: 2px;
        z-index: -1;
    }
`;

const optionList = css`
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    border-radius: 12px;
    margin: 0 16px 8px;
    overflow: hidden;
    box-shadow: rgba(0, 0, 0, 0.06) 0px 1px 4px;
`;

export default SettingPage;
