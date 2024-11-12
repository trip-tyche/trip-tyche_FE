import type { AxiosRequestConfig as OriginalAxiosRequestConfig } from 'axios';

declare module 'axios' {
    interface AxiosRequestConfig extends OriginalAxiosRequestConfig {
        skipAuth?: boolean;
    }
}
