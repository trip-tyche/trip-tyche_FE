import axios from 'axios';

import { API_BASE_URL } from '@/libs/apis/shared/constants';
import { setupRequestInterceptor, setupResponseInterceptor } from '@/libs/apis/shared/interceptors';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10 * 1000,
    withCredentials: true,
});

setupRequestInterceptor(apiClient);
setupResponseInterceptor(apiClient);
