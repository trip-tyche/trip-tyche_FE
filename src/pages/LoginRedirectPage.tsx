import { useEffect } from 'react';

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

    // useEffect(() => {
    //     if (userId && token) {
    //         setUserIdAndToken();
    //     } else {
    //         navigate(PATH.LOGIN, { replace: true });
    //     }
    // }, []);
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const userId = params.get('userId');
        const token = params.get('token');

        if (userId && token) {
            setUserIdAndToken();
        } else {
            // 현재 호스트를 기반으로 로그인 URL 생성
            const loginUrl = `${window.location.origin}${PATH.LOGIN}`;
            window.location.href = loginUrl; // 전체 페이지 리다이렉트
        }
    }, [location]);

    const setUserIdAndToken = () => {
        setLogin(JSON.parse(userId), token);
        navigate(PATH.HOME, { replace: true });
    };

    return <Loading />;
};

export default LoginRedirectPage;

// http://trip-tyche-fe.s3-website.ap-northeast-2.amazonaws.com/login/oauth2/code/google?state=jflv-SwKPgJ2H-Pi1gU_UZaSgLneDr7lO_Rb6DfvPY4%3D&code=4%2F0AVG7fiSYIYf1dmso5SpdscbSz0-2G6K2nGNsFdcEz72yCrHG_k1UlHgHzyKftHuSeRLftg&scope=email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&authuser=0&prompt=none
