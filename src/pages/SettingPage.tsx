import { useState } from 'react';

import { css } from '@emotion/react';
import { User, MessageCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Header from '@/components/common/Header';
import ConfirmModal from '@/components/features/guide/ConfirmModal';
import NickNameEditor from '@/components/features/user/NickNameEditor';
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

    const confirmLogoutModal = () => {
        closeModal();
        setLogout();
        navigate(PATH.AUTH.LOGIN);
    };

    return (
        <div css={myPageContainerStyle}>
            <Header
                title={isEditing ? '닉네임 변경' : '설정'}
                isBackButton
                onBack={
                    isEditing
                        ? () => {
                              setIsEditing(false);
                          }
                        : () => navigate(PATH.MAIN)
                }
            />
            {isEditing ? (
                <NickNameEditor setIsEditing={setIsEditing} />
            ) : (
                <main css={mainStyle}>
                    <div css={userInfoContainer}>
                        <p>
                            <span>{userNickName}</span>, 님
                        </p>
                    </div>
                    <nav css={navStyle}>
                        <button css={navItemStyle} onClick={() => setIsEditing(true)}>
                            <User size={20} />
                            <span>닉네임 수정</span>
                        </button>
                        <button css={navItemStyle} onClick={() => console.log('문의하기')}>
                            <MessageCircle size={20} />
                            <span>문의하기</span>
                        </button>
                        <button css={navItemStyle} onClick={openModal}>
                            <LogOut size={20} />
                            <span>로그아웃</span>
                        </button>
                    </nav>
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
                </main>
            )}
        </div>
    );
};

const nicknameStyle = css`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 48px;
    padding: 8px;
`;

const inputContainer = css`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 104px;
    padding: 0 12px;

    h1 {
        font-size: ${theme.fontSizes.large_16};
        font-weight: 600;
        color: ${theme.colors.black};
        margin-top: 12px;
    }
    p {
        margin-top: 8px;
        margin-left: 4px;
        color: #ff0101;
        font-size: ${theme.fontSizes.normal_14};
    }
`;

const baseInputStyle = css`
    border-radius: 8px;
    padding: 12px;
    font-size: ${theme.fontSizes.large_16};
    width: 100%;
    height: 38px;
    outline: none;
    margin-top: 18px;
`;

const inputStyle = (inputValue: string) => css`
    ${baseInputStyle};
    border: 1px solid ${inputValue.length === 1 || inputValue.length > 10 ? '#ff0101' : '#DDDDDD'};
    font-size: ${theme.fontSizes.large_16};
`;

const buttonContainer = css`
    width: 100%;
    padding: 0 12px;
    margin: 24px 0 12px 0;
`;

const myPageContainerStyle = css`
    height: 100dvh;
    display: flex;
    flex-direction: column;
`;

const mainStyle = css`
    padding: 20px;
`;
const userInfoContainer = css`
    span {
        font-size: ${theme.fontSizes.xlarge_18};
        font-weight: 600;
    }
    margin-bottom: 18px;
    height: 38px;
    display: flex;
    align-items: center;
`;

const navStyle = css`
    display: flex;
    flex-direction: column;
`;

const navItemStyle = css`
    display: flex;
    align-items: center;
    background: none;
    border: none;
    text-align: left;
    font-size: ${theme.fontSizes.large_16};
    padding: 15px 0;
    cursor: pointer;
    color: ${theme.colors.black};

    span {
        margin-left: 10px;
    }
`;

export default SettingPage;
