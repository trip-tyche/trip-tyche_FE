export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
    USERS: '/api/user',
    TRIPS: '/api/trips',
} as const;

const OAUTH_URL = 'oauth2/authorization';

export const OAUTH_CONFIG = {
    PATH: {
        KAKAO: `${API_BASE_URL}/${OAUTH_URL}/kakao`,
        GOOGLE: `${API_BASE_URL}/${OAUTH_URL}/google`,
    },
} as const;
