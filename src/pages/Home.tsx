import { css } from '@emotion/react';
import FightHeader from '@/components/layout/Header/AirplaneHeader';
import Card from '@/components/common/Card';
import LogoImages from '@/components/common/LogoImages';
import Navbar from '@/components/common/Navbar';

export default function Home() {
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
