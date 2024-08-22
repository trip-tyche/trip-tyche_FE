import { css } from '@emotion/react';
import FightHeader from '@/components/layout/Header/AirplaneHeader';
import Card from '@/components/common/Card';
import LogoImages from '@/components/common/LogoImages';
import Navbar from '@/components/common/Navbar';
import OverLay from '@/components/common/OverLay';
import { useEffect, useState } from 'react';
import SingleInputModal from '@/components/common/Modal/SingleInputModal';
import useLoginState from '@/store/LoginState';
import useFirstUser from '@/store/FirstUser';

export default function Home() {
    const [_, setIsOpenModal] = useState<boolean>(false);
    const [useName, setUseName] = useState<string>('');
    const setIsLogin = useLoginState((state) => state.setIsLogin);
    const isFirstUser = useFirstUser((state) => state.isFirstUser);
    const setIsFirstUser = useFirstUser((state) => state.setIsFirstUser);

    useEffect(() => {
        setIsLogin(true);
        checkFirstUser();
    }, []);

    const checkFirstUser = () => {
        if (isFirstUser) setIsOpenModal(true);
    };

    const closeModal = () => {
        setIsOpenModal(false);
        setIsFirstUser(false);
    };

    const submitUserName = () => {
        console.log(`${useName} 님이 가입했습니다.`);
        setUseName('');
        closeModal();
    };

    return (
        <div css={containerStyle}>
            <main css={mainContentStyle}>
                <FightHeader />
                <div css={cardContainerStyle}>
                    <Card />
                </div>

                <LogoImages />

                <p css={description}>동남아킬러 님의 여행을 기억해주세요 😀</p>
            </main>

            {isFirstUser && (
                <>
                    <OverLay closeModal={closeModal} />
                    <SingleInputModal
                        titleText='당신의 이름을 알려주세요'
                        descriptionText='한국어, 영어, 숫자 등 최소 4자리를 입력해주세요.'
                        exampleText='(예. 동남아킬러24)'
                        submitModal={submitUserName}
                        setInputValue={setUseName}
                        value={useName}
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

const cardContainerStyle = css`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 3rem 0;
    display: flex;
`;

const description = css`
    flex: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    /* margin-top: 5rem; */
`;
