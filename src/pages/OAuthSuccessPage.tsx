import { useEffect } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';

import useAuthStore from '@/stores/useAuthStore';

const userId = 1234;
const token = 'tokentokentokentokentokentokentokentokentokentokentoken';

const OAuthSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const setLogin = useAuthStore((state) => state.setLogin);

    useEffect(() => {
        // const params = new URLSearchParams(location.search);
        // const userId = params.get('userId');
        // const token = params.get('token');
        // console.log(userId, token);
        if (userId && token) {
            // 로그인 정보 저장
            setLogin(userId, token);
            console.log('Login success');
            // 홈페이지로 리다이렉트
            navigate('/', { replace: true });
        } else {
            console.error('Login failed: Missing userId or token');
            navigate('/login', { replace: true });
        }
    }, [location, setLogin, navigate]);

    return <div>로그인 처리 중...</div>;
};

export default OAuthSuccessPage;
