import { useEffect } from 'react';

import { css } from '@emotion/react';
import { useNavigate, useLocation } from 'react-router-dom';

import Loading from '@/components/common/Loading';
import { PATH } from '@/constants/path';
import useAuthStore from '@/stores/useAuthStore';

const LoginRedirectPage = () => {
    const setLogin = useAuthStore((state) => state.setLogin);

    const navigate = useNavigate();
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const userId = params.get('userId') as string;
    const token = params.get('token') as string;

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const userId = params.get('userId');
        const token = params.get('token');

        if (userId && token) {
            setUserIdAndToken();
        } else {
            // 현재 호스트를 기반으로 로그인 URL 생성
            const loginUrl = `${window.location.origin}${PATH.AUTH.LOGIN}`;
            window.location.href = loginUrl; // 전체 페이지 리다이렉트
        }
    }, [location]);

    const setUserIdAndToken = () => {
        setLogin(JSON.parse(userId), token);
        navigate(PATH.MAIN, { replace: true });
    };

    return (
        <div css={loadingSpinnerStyle}>
            <Loading />
        </div>
    );
};

const loadingSpinnerStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100dvh;
`;

export default LoginRedirectPage;
