import { useEffect } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';
import { HashLoader } from 'react-spinners';

import useAuthStore from '@/stores/useAuthStore';

const OAuthSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const setLogin = useAuthStore((state) => state.setLogin);

    const params = new URLSearchParams(location.search);
    const userId = params.get('userId') as string;
    const token = params.get('token') as string;

    useEffect(() => {
        if (userId && token) {
            setUserIdAndToken();
        } else {
            navigate('/login', { replace: true });
        }
    }, [location]);

    const setUserIdAndToken = async () => {
        await setLogin(JSON.parse(userId), token);
        // 로컬 스토리지 저장 확인을 위해 비동기 처리
        navigate('/', { replace: true });
    };

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
