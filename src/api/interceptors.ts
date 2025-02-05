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

                switch (status) {
                    case 401:
                    case 403:
                        setLogout();
                        showToast('로그인이 필요합니다.');
                        window.location.href = '/login';
                        break;

                    case 500:
                    case 502:
                    case 503:
                        showToast('서버에 일시적인 문제가 발생했습니다.');
                        break;

                    default:
                        showToast('예기치 않은 오류가 발생했습니다.');
                }
            }

            return Promise.reject(error);
        },
    );
};
