import axios from 'axios';

import { setupRequestInterceptor, setupResponseInterceptor } from '@/api/interceptors';
import { DEFAULT_HEADERS, ENV } from '@/constants/api';

export const apiClient = axios.create({
    baseURL: ENV.API_BASE_URL,
    headers: DEFAULT_HEADERS,
    timeout: 5000,
});

setupRequestInterceptor(apiClient);
setupResponseInterceptor(apiClient);