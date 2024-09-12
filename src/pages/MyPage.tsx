import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

import { fetchUserInfo } from '@/api/user';
import characterImg from '@/assets/images/character.png';
import Button from '@/components/common/Button/Button';
import ColumnButtonModal from '@/components/common/Modal/ColumnButtonModal';
import OverLay from '@/components/common/OverLay';
import Header from '@/components/layout/Header';
import { PATH } from '@/constants/path';
import useAuthStore from '@/stores/useAuthStore';
import theme from '@/styles/theme';

const MyPage = () => {
    const navigator = useNavigate();

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [userNickName, setUserNickName] = useState('');
    const logout = useAuthStore((state) => state.logout);

    useEffect(() => {
        const getUserNickName = async () => {
            const { userNickName } = await fetchUserInfo();
            console.log(userNickName);
            setUserNickName(userNickName);
        };

        getUserNickName();
    }, []);

    const openModal = () => {
        setIsLogoutModalOpen(true);
    };
    const closeModal = () => {
        setIsLogoutModalOpen(false);
    };

    const confirmModal = () => {
        setIsLogoutModalOpen(false);
        logout();
        navigator(PATH.LOGIN);
    };

    return (
        <div css={containerStyle}>
            <Header title='마이페이지' isBackButton />
            <div css={imgContainerStyle}>
                <img src={characterImg} className='characterImg' alt='character' />
            </div>

            <p css={textWrapper}>안녕하세요, {userNickName} 님</p>

            <div css={buttonWrapper}>
                <Button text='로그아웃' theme='sec' size='sm' onClick={openModal} />
            </div>

            {isLogoutModalOpen && (
                <>
                    <OverLay closeModal={closeModal} />
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
