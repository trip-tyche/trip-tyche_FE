import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

import useAuthStore from '@/stores/useAuthStore';
import { useToastStore } from '@/stores/useToastStore';
import { getToken } from '@/utils/auth';

export const setupRequestInterceptor = (instance: AxiosInstance) => {
    instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const jwtToken = getToken();
            config.headers.Authorization = `Bearer ${jwtToken}`;

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
            console.log('response', response);
            return response.data;
        },
        (error) => {
            const { setLogout } = useAuthStore.getState();
            const { showToast } = useToastStore.getState();

            if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
                showToast('네트워크 연결을 확인해주세요.');
                return Promise.reject(error);
            }

            if (error.request && !error.response) {
                showToast('서버와의 연결이 원활하지 않습니다.');
                return Promise.reject(error);
            }

            if (error.response) {
                const { status } = error.response.data;

                // TODO: 액세스 토큰 재발급 로직 추가
                if (status === 401) {
                    setLogout();
                    showToast('로그인이 필요합니다.');
                    window.location.href = '/login';
                    return;
                }

                if (status === 403) {
                    setLogout();
                    showToast('자동 로그아웃 되었습니다.');
                    window.location.href = '/login';
                    return;
                }

                if (status === 500) {
                    showToast('서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
                    return Promise.reject(error);
                }
            }

            return Promise.reject(error);
        },
    );
};
