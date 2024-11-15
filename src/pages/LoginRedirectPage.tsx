import { useEffect } from 'react';

import { css } from '@emotion/react';
import { useNavigate, useLocation } from 'react-router-dom';

import Loading from '@/components/common/Spinner';
import { PATH } from '@/constants/path';
import useAuthStore from '@/stores/useAuthStore';
import { useToastStore } from '@/stores/useToastStore';

interface ErrorResponse {
    status: number;
    code: number;
    message: string;
    data: null;
    httpStatus: string;
}

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

    useEffect(() => {
        const params = new URLSearchParams(location.search);

        // 에러 체크
        const errorData = params.get('error_data');
        if (errorData) {
            try {
                const error = JSON.parse(decodeURIComponent(errorData)) as ErrorResponse;

                switch (error.status) {
                    case 409:
                        showToast(error.message || '이미 가입된 이메일입니다.');
                        break;
                    default:
                        showToast('로그인 중 오류가 발생했습니다.');
                }

                // 로그인 페이지로 리다이렉트
                const loginUrl = `${window.location.origin}${PATH.AUTH.LOGIN}`;
                window.location.href = loginUrl;
                return;
            } catch (e) {
                console.error('에러 데이터 파싱 실패:', e);
            }
        }

        // 정상적인 로그인 처리
        const userId = params.get('userId');
        const token = params.get('token');

        if (userId && token) {
            try {
                setLogin(JSON.parse(userId), token);
                navigate(PATH.MAIN, { replace: true });
            } catch (e) {
                console.error('로그인 처리 중 오류 발생:', e);
                showToast('로그인 처리 중 오류가 발생했습니다.');
                const loginUrl = `${window.location.origin}${PATH.AUTH.LOGIN}`;
                window.location.href = loginUrl;
            }
        } else {
            console.log('인증 정보가 없습니다.');
            const loginUrl = `${window.location.origin}${PATH.AUTH.LOGIN}`;
            window.location.href = loginUrl;
        }
    }, [location, setLogin, navigate, showToast]);

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
