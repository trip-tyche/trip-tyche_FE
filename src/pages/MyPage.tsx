import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { User, MessageCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { getUserData } from '@/api/user';
import ConfirmModal from '@/components/common/modal/ConfirmModal';
import Header from '@/components/layout/Header';
import { LOGOUT_MODAL } from '@/constants/message';
import { PATH } from '@/constants/path';
import useAuthStore from '@/stores/useAuthStore';
import { useModalStore } from '@/stores/useModalStore';
import theme from '@/styles/theme';

const MyPage = () => {
    const { isModalOpen, openModal, closeModal } = useModalStore();
    const setLogout = useAuthStore((state) => state.setLogout);

    const navigate = useNavigate();

    const userNickName = localStorage.getItem('userNickName') || 'TripTyche';

    const confirmModal = () => {
        closeModal();
        setLogout();
        navigate(PATH.LOGIN);
    };

    return (
        <>
            <Header title='설정' isBackButton onBack={() => navigate(PATH.HOME)} />
            <div css={[myPageContainerStyle]}>
                <div css={userInfoContainer}>
                    <p>{userNickName}</p>
                </div>
                <nav css={navStyle}>
                    <button css={navItemStyle} onClick={() => console.log('내 정보')}>
                        <User size={20} />
                        <span>프로필 수정</span>
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
            </div>

            {isModalOpen && (
                <ConfirmModal
                    title={LOGOUT_MODAL.TITLE}
                    description={LOGOUT_MODAL.MESSAGE}
                    confirmText={LOGOUT_MODAL.CONFIRM_TEXT}
                    cancelText={LOGOUT_MODAL.CANCEL_TEXT}
                    confirmModal={confirmModal}
                    closeModal={closeModal}
                />
            )}
        </>
    );
};

const myPageContainerStyle = css`
    height: calc(100vh - 54px);
    display: flex;
    flex-direction: column;
    padding: 20px;
`;

const userInfoContainer = css`
    font-size: ${theme.fontSizes.xxlarge_20};
    font-weight: 600;
    margin-bottom: 20px;
    height: 44px;
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

export default MyPage;
