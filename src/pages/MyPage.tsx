import Navbar from '@/components/common/Navbar';
import Header from '@/components/layout/Header/Header';
import characterImg from '@/assets/images/character.png';
import { css } from '@emotion/react';
import Button from '@/components/common/Button/Button';
import { useState } from 'react';
import ColumnButtonModal from '@/components/common/Modal/ColumnButtonModal';
import OverLay from '@/components/common/OverLay';
import { useNavigate } from 'react-router-dom';
import useFirstUser from '@/store/FirstUser';
import useLoginState from '@/store/LoginState';

export default function MyPage() {
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const setIsLogin = useLoginState((state) => state.setIsLogin);
    const setIsFirstUser = useFirstUser((state) => state.setIsFirstUser);

    const navigator = useNavigate();

    const openModal = () => {
        setIsLogoutModalOpen(true);
    };
    const closeModal = () => {
        setIsLogoutModalOpen(false);
    };

    const confirmModal = () => {
        setIsLogoutModalOpen(false);
        setIsLogin(false);
        setIsFirstUser(true);
        navigator('/');
    };

    return (
        <div css={containerStyle}>
            <Header title='마이페이지' />

            <main css={mainContentStyle}>
                <div css={imgContainerStyle}>
                    <img src={characterImg} className='characterImg' alt='character' />
                </div>

                <p css={textWrapper}>안녕하세요, 동남아킬러 님</p>

                <div css={buttonWrapper}>
                    <Button text='로그아웃' theme='sec' size='sm' onClick={openModal} />
                </div>
            </main>

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

            <Navbar />
        </div>
    );
}

const containerStyle = css`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

const mainContentStyle = css`
    flex: 1;
    margin-bottom: 6rem;

    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const imgContainerStyle = css`
    flex: 1;

    display: flex;
    justify-content: center;
    align-items: center;

    .characterImg {
        width: 160px;
    }
`;

const textWrapper = css`
    font-size: 24px;
    font-weight: 600;
    text-align: center;
`;

const buttonWrapper = css`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
`;
