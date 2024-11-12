import axios from 'axios';

import { DEFAULT_HEADERS } from '@/constants/api';
import { ENV } from '@/constants/auth';
import { getToken } from '@/utils/auth';

export const apiClient = axios.create({
    baseURL: ENV.API_BASE_URL,
    headers: DEFAULT_HEADERS,
});
