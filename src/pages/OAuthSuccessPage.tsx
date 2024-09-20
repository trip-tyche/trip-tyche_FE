import { useEffect } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';
import { HashLoader } from 'react-spinners';

import { PATH } from '@/constants/path';
import useAuthStore from '@/stores/useAuthStore';

const OAuthSuccessPage = () => {
    const setLogin = useAuthStore((state) => state.setLogin);

    const navigate = useNavigate();
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const userId = params.get('userId') as string;
    const token = params.get('token') as string;
    console.log(typeof userId, typeof token);
    useEffect(() => {
        if (userId && token) {
            setUserIdAndToken();
        } else {
            navigate(PATH.LOGIN, { replace: true });
        }
    }, [location]);

    const setUserIdAndToken = () => {
        setLogin(JSON.parse(userId), token);
        navigate(PATH.HOME, { replace: true });
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
