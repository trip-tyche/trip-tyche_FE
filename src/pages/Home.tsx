import useIsLoginStore from '../store/loginStore';
import { LoginState } from '../types/loginStore';
import { css } from '@emotion/react';
import FightHeader from '../components/layout/Header/AirplaneHeader';
import Card from '@/components/common/Card';
import LogoImages from '@/components/common/LogoImages';
import Navbar from '@/components/common/Navbar';

export default function Home() {
    const setIsLogin = useIsLoginStore((state: LoginState) => state.setIsLogin);
    setIsLogin(true);

    return (
        <>
            <div css={ContainerStyle}>
                <FightHeader />
                <div css={CardContainerStyle}>
                    <Card />
                </div>

                <LogoImages />

                <p css={Description}>동남아킬러 님의 여행을 기억해주세요 😀</p>

                <Navbar />
            </div>
        </>
    );
}

const ContainerStyle = css`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    position: relative;
`;

const CardContainerStyle = css`
    margin-top: 40px;
    margin-bottom: 30px;
    display: flex;
    justify-content: center;
`;

const Description = css`
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    margin-top: 32px;
`;
