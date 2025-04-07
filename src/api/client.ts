import axios from 'axios';

import { setupRequestInterceptor, setupResponseInterceptor } from '@/api/interceptors';
import { ENV } from '@/constants/api/config';

export const apiClient = axios.create({
    baseURL: ENV.API_BASE_URL,
    timeout: 10 * 1000,
    withCredentials: true,
});

setupRequestInterceptor(apiClient);
setupResponseInterceptor(apiClient);
