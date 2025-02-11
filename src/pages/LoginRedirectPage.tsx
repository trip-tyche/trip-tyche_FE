import { useEffect } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';

import Loading from '@/components/common/Spinner';
import { ROUTES } from '@/constants/paths';
import useAuthStore from '@/stores/useAuthStore';
import { useToastStore } from '@/stores/useToastStore';

const LoginRedirectPage = () => {
    const setLogin = useAuthStore((state) => state.setLogin);
    const { showToast } = useToastStore();

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);

        const userId = params.get('userId');
        const token = params.get('token');

        if (userId && token) {
            const currentTime = new Date().getTime();
            localStorage.setItem('lastLoginTime', String(currentTime));
            setLogin(JSON.parse(userId), token);
            navigate(ROUTES.PATH.MAIN, { replace: true });
            return;
        }

        showToast('로그인 처리 중 오류가 발생했습니다.');
        const loginUrl = `${window.location.origin}${ROUTES.PATH.AUTH.LOGIN}`;
        window.location.href = loginUrl;
        navigate(ROUTES.PATH.AUTH.LOGIN, { replace: true });
    }, [location, setLogin, navigate, showToast]);

    return <Loading />;
};

export default LoginRedirectPage;
