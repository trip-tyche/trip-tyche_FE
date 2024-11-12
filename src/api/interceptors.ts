import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

import { getToken } from '@/utils/auth';

declare module 'axios' {
    export interface AxiosRequestConfig {
        skipAuth?: boolean;
    }
}

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
            return Promise.reject(error);
        },
    );
};
