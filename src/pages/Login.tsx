import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

import KakaoButton from '@/components/common/Button/KakaoButton';
import LogoImages from '@/components/common/LogoImages';
import FightHeader from '@/components/layout/AirplaneHeader';
import useLoginState from '@/stores/LoginState';

const Login = () => {
    const navigate = useNavigate();
    const setIsLogin = useLoginState((state) => state.setIsLogin);

    // const REST_API_KEY = '111111111';
    // const REDIRECT_URI = '/kakao/callback';
    // const link: string = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

    const handleLogin = () => {
        // window.location.href = link;
        setIsLogin(true);
        navigate('/home');
    };

    return (
        <div css={containerStyle}>
            <FightHeader />
            <div css={textContainerStyle}>
                <h2>오감 저리는 여행 기록 플랫폼</h2>
                <p>오감 저리는 여행 기록 플랫폼입니다.</p>
                <p>오감 저리게 시작해보세요</p>
            </div>

            <LogoImages />

            <div className='button-container' css={buttonContainerStyle}>
                <KakaoButton handleLogin={handleLogin} />
            </div>
        </div>
    );
};

const containerStyle = css`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
`;

const textContainerStyle = css`
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    h2 {
        color: #333;

        text-align: center;
        font-size: 24px;
        font-weight: 600;
        margin: 2rem 0;
    }
    p {
        color: #89898f;
        text-align: center;
        font-size: 16px;
    }
`;

const buttonContainerStyle = css`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-top: 7rem;
    margin-bottom: 1rem;
`;

export default Login;
