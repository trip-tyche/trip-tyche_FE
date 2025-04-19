import axios from 'axios';

import { API_BASE_URL } from '@/libs/apis/constants';
import { setupRequestInterceptor, setupResponseInterceptor } from '@/libs/apis/interceptors';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10 * 1000,
    withCredentials: true,
});

setupRequestInterceptor(apiClient);
setupResponseInterceptor(apiClient);
