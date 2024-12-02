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

    // const params = new URLSearchParams(location.search);
    // const userId = params.get('userId') as string;
    // const token = params.get('token') as string;

    // useEffect(() => {
    //     const params = new URLSearchParams(location.search);
    //     const userId = params.get('userId');
    //     const token = params.get('token');

    //     if (userId && token) {
    //         setUserIdAndToken();
    //         console.log('있어요!');
    //     } else {
    //         console.log('없어요!');
    //         // 현재 호스트를 기반으로 로그인 URL 생성
    //         const loginUrl = `${window.location.origin}${PATH.AUTH.LOGIN}`;
    //         window.location.href = loginUrl; // 전체 페이지 리다이렉트
    //     }
    // }, [location]);

    // const setUserIdAndToken = () => {
    //     setLogin(JSON.parse(userId), token);
    //     navigate(PATH.MAIN, { replace: true });
    // };

    // useEffect(() => {
    //     const fetchToken = async () => {
    //         const newData = await axios.get('http://192.168.0.103:8080/oauth2/success');
    //         console.log(newData);
    //         return newData;
    //     };

    //     fetchToken();
    // }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);

        const userId = params.get('userId');
        const token = params.get('token');

        if (userId && token) {
            try {
                const currentTime = new Date().getTime();
                localStorage.setItem('lastLoginTime', String(currentTime));
                setLogin(JSON.parse(userId), token);
                navigate(ROUTES.PATH.MAIN, { replace: true });
            } catch (error) {
                showToast('로그인 처리 중 오류가 발생했습니다.');
                const loginUrl = `${window.location.origin}${ROUTES.PATH.AUTH.LOGIN}`;
                window.location.href = loginUrl;
            }
        } else {
            const loginUrl = `${window.location.origin}${ROUTES.PATH.AUTH.LOGIN}`;
            window.location.href = loginUrl;
        }
    }, [location, setLogin, navigate, showToast]);

    return <Loading />;
};

export default LoginRedirectPage;
