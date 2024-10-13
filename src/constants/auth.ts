export const OAUTH_URL = 'oauth2/authorization';

export const SOCIAL_LOGIN = {
    KAKAO: '카카오 계정으로 로그인',
    GOOGLE: 'Google 계정으로 로그인',
};

export const ENV = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL, // 개발 서버
    // BASE_URL: '', // 운영 서버
    GOOGLE_MAPS_API_KEY: import.meta.env.VITE_API_GOOGLE_MAPS_API_KEY,
};
