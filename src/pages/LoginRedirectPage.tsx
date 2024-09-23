import { useEffect } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';

import Loading from '@/components/Loading';
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
        if (userId && token) {
            setUserIdAndToken();
        } else {
            navigate(PATH.LOGIN, { replace: true });
        }
    }, []);

    const setUserIdAndToken = () => {
        setLogin(JSON.parse(userId), token);
        navigate(PATH.HOME, { replace: true });
    };

    return <Loading />;
};

export default LoginRedirectPage;
