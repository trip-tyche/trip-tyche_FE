import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

import { fetchUserInfo } from '@/api/user';
import characterImg from '@/assets/images/character.png';
import Button from '@/components/common/Button/Button';
import ColumnButtonModal from '@/components/common/Modal/ColumnButtonModal';
import ModalOverlay from '@/components/common/Modal/ModalOverlay';
import { PATH } from '@/constants/path';
import useAuthStore from '@/stores/useAuthStore';
import { useModalStore } from '@/stores/useModalStore';
import theme from '@/styles/theme';
import { getUserId } from '@/utils/auth';

const MyPage = () => {
    const navigator = useNavigate();

    const { isModalOpen, openModal, closeModal } = useModalStore();
    // const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [userNickName, setUserNickname] = useState('');
    const setLogout = useAuthStore((state) => state.setLogout);

    useEffect(() => {
        const getUserNickName = async () => {
            const userId = getUserId();
            if (!userId) {
                console.error('Token or userId not found');
                // 로그인 페이지로 리다이렉트 또는 다른 처리
                return;
            }

            const { userNickName } = await fetchUserInfo(userId);
            setUserNickname(userNickName);
        };

        getUserNickName();
    }, []);

    const confirmModal = () => {
        closeModal();
        setLogout();
        navigator(PATH.LOGIN);
    };

    return (
        <div css={containerStyle}>
            <div css={imgContainerStyle}>
                <img src={characterImg} className='characterImg' alt='character' />
            </div>

            <p css={textWrapper}>안녕하세요, {userNickName} 님</p>

            <div css={buttonWrapper}>
                <Button text='로그아웃' theme='sec' size='sm' onClick={openModal} />
            </div>

            {isModalOpen && (
                <>
                    <ModalOverlay closeModal={closeModal} />
                    <ColumnButtonModal
                        titleText='로그아웃'
                        descriptionText='정말 로그아웃할까요?'
                        confirmText='로그아웃'
                        cancelText='닫기'
                        confirmModal={confirmModal}
                        closeModal={closeModal}
                    />
                </>
            )}
        </div>
    );
};

const containerStyle = css`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding-bottom: 80px;
`;

const imgContainerStyle = css`
    flex: 1;

    display: flex;
    justify-content: center;
    align-items: center;

    .characterImg {
        width: 120px;
    }
`;

const textWrapper = css`
    font-size: ${theme.fontSizes.xxlarge_20};
    font-weight: 600;
    text-align: center;
`;

const buttonWrapper = css`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export default MyPage;
