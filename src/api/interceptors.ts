import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

import useAuthStore from '@/stores/useAuthStore';
import { useToastStore } from '@/stores/useToastStore';
import { getToken } from '@/utils/auth';

export const setupRequestInterceptor = (instance: AxiosInstance) => {
    instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const jwtToken = getToken();
            if (!config.skipAuth) {
                config.headers.Authorization = `Bearer ${jwtToken}`;
            }
            return config;
        },
        (error: AxiosError) => {
            return Promise.reject(error);
        },
    );
};

export const setupResponseInterceptor = (instance: AxiosInstance) => {
    instance.interceptors.response.use(
        (response) => {
            return response.data;
        },
        (error) => {
            const { setLogout } = useAuthStore.getState();
            const { showToast } = useToastStore.getState();

            // if (error.code === 'ECONNABORTED') {
            //     console.error('요청 시간이 초과되었습니다. 네트워크 상태를 확인하고 다시 시도해주세요.');
            //     return;
            // }

            setLogout();
            showToast(error.message || '이미 가입된 이메일입니다.');
            window.location.href = '/login';

            // if (error.response) {
            //     // 서버가 응답은 했지만 에러 상태코드를 반환한 경우
            //     // switch (error.response.status) {
            //     //     case 400: // Bad Request
            //     //         // 클라이언트의 잘못된 요청
            //     //         console.error(error.message || '잘못된 요청입니다');
            //     //         break;
            //     //     case 401: // Unauthorized
            //     //         // 인증 실패 또는 토큰 만료
            //     //         setLogout();
            //     //         window.location.href = '/login';
            //     //         console.error(error.message || '인증이 필요합니다');
            //     //         break;
            //     //     case 403: // Forbidden
            //     //         console.error(error.message || '접근 권한이 없습니다.');
            //     //         break;
            //     //     case 404: // Not Found
            //     //         // 요청한 리소스가 존재하지 않음
            //     //         console.error(error.message || '요청한 리소스를 찾을 수 없습니다');
            //     //         break;
            //     //     case 409: // Conflict
            //     //         // 서버의 현재 상태와 요청이 충돌 (kakao계정 이메일 == google계정 이메일)
            //     //         showToast(error.message || '이미 가입된 이메일입니다.');
            //     //         console.error(error.message || '이미 가입된 이메일입니다.');
            //     //         break;
            //     //     case 500:
            //     //         console.error(error.message || '서버 에러가 발생했습니다');
            //     //         break;
            //     // }
            // } else if (error.request) {
            //     // 요청은 보냈지만 서버로부터 아무 응답도 받지 못한 경우 (timeout, 네트워크 끊김 등)
            //     window.location.href = '/login';
            //     console.error('서버로부터 응답이 없습니다', error.message);
            // } else {
            //     // 요청 자체를 보내기 전에 발생한 에러 (잘못된 설정, URL 등)
            //     console.error('요청 설정 중 에러가 발생했습니다:', error.message);
            // }

            return Promise.reject(error);
        },
    );
};
