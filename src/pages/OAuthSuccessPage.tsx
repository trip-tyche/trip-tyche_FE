import { useEffect, useState } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';
import { HashLoader } from 'react-spinners';

import useAuthStore from '@/stores/useAuthStore';

// const userId = 1;
// const token = 'tokentokentokentokentokentokentokentokentokentokentoken';

const OAuthSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const setLogin = useAuthStore((state) => state.setLogin);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const userId = params.get('userId');
        const token = params.get('token');

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

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100vw',
            }}
        >
            <HashLoader color='#85a878' size={50} speedMultiplier={0} />
        </div>
    );
};

export default OAuthSuccessPage;
