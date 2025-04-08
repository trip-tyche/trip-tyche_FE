import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

import { apiClient } from '@/api/client';
import useAuthStore from '@/stores/useAuthStore';
import { useToastStore } from '@/stores/useToastStore';

export const setupRequestInterceptor = (instance: AxiosInstance) => {
    instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
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
        async (error) => {
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

                try {
                    // TODO: 401로 변경 및 에러 전파 방지
                    if (status === 401) {
                        setLogout();
                        showToast('로그인이 필요합니다.');
                        await apiClient.post(`/v1/auth/refresh`);
                        return apiClient(error.config);
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
                } catch (error) {
                    console.log('hello');
                }
            }

            return Promise.reject(error);
        },
    );
};
