import { useNavigate } from 'react-router-dom';
import useIsLoginStore from '../store/loginStore';
import { LoginState } from '../types/loginStore';
import { css } from '@emotion/react';
import KakaoButton from '../components/common/Button/KakaoButton';
import FightHeader from '../components/layout/Header/AirplaneHeader';
import LogoImages from '@/components/common/LogoImages';

export default function Login() {
    const setIsLogin = useIsLoginStore((state: LoginState) => state.setIsLogin);
    setIsLogin(false);

    const navigate = useNavigate();

    // const REST_API_KEY = '111111111';
    // const REDIRECT_URI = '/kakao/callback';
    // const link: string = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

    const handleLogin = () => {
        // window.location.href = link;
        navigate('/home');
    };

    return (
        <div css={ContainerStyle}>
            <FightHeader />
            <div css={TextContainerStyle}>
                <h2>오감 저리는 여행 기록 플랫폼</h2>
                <p>오감 저리는 여행 기록 플랫폼입니다.</p>
                <p>오감 저리게 시작해보세요</p>
            </div>

            <LogoImages />

            <div className='button-container' css={ButtonContainerStyle}>
                <KakaoButton handleLogin={handleLogin} />
            </div>
        </div>
    );
}

const ContainerStyle = css`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
`;

const TextContainerStyle = css`
    margin-top: 30px;
    margin-bottom: 50px;
    h2 {
        color: #333;

        text-align: center;
        font-size: 24px;
        font-weight: 600;
        margin: 20px 0;
    }
    p {
        color: #89898f;
        text-align: center;
        font-size: 16px;
    }
`;

const ButtonContainerStyle = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-top: 80px;
    margin-bottom: 90px;
`;
