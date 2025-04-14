import axios from 'axios';

import { API_BASE_URL } from '@/api/constants';
import { setupRequestInterceptor, setupResponseInterceptor } from '@/api/interceptors';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10 * 1000,
    withCredentials: true,
});

setupRequestInterceptor(apiClient);
setupResponseInterceptor(apiClient);
