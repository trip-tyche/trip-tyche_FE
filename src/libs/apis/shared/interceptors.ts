import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

import useUserStore from '@/domains/user/stores/useUserStore';
import { apiClient } from '@/libs/apis/shared/client';
import { API_BASE_URL } from '@/libs/apis/shared/constants';
import { useToastStore } from '@/shared/stores/useToastStore';

interface ErrorResponse<T> {
    status: number;
    code: string;
    message: string;
    data: T;
    httpStatus: string;
}

interface CustomRequestConfing extends InternalAxiosRequestConfig {
    isAlreadyRequest?: boolean;
}

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
        async (error: AxiosError<ErrorResponse<null>>) => {
            const { logout } = useUserStore.getState();
            const { showToast } = useToastStore.getState();

            const originalRequest = error.config as CustomRequestConfing;

            if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
                showToast('네트워크 연결을 확인해주세요.');
                return Promise.reject(error);
            }

            if (error.request && !error.response) {
                showToast('서버와의 연결이 원활하지 않습니다.');
                return Promise.reject(error);
            }

            if (error.response && originalRequest && !originalRequest.isAlreadyRequest) {
                originalRequest.isAlreadyRequest = true;
                const { status } = error.response.data;

                try {
                    if (status === 401) {
                        try {
                            await axios.post(
                                `${API_BASE_URL}/v1/auth/refresh`,
                                {},
                                {
                                    withCredentials: true,
                                },
                            );
                            return apiClient(originalRequest);
                        } catch (error) {
                            logout();
                            return Promise.resolve({});
                        }
                    }

                    if (status === 403) {
                        logout();
                        return Promise.resolve();
                    }

                    if (status === 500) {
                        error.response.data.message = '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요';
                        return Promise.reject(error);
                    }
                } catch (error) {
                    console.error('interceptor error: ', error);
                    return Promise.reject(error);
                }
            }

            return Promise.reject(error);
        },
    );
};
