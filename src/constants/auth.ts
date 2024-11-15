import { ENV } from '@/constants/api';

const OAUTH_URL = 'oauth2/authorization';

export const OAUTH_PATH = {
    KAKAO: `${ENV.API_BASE_URL}/${OAUTH_URL}/kakao`,
    GOOGLE: `${ENV.API_BASE_URL}/${OAUTH_URL}/google`,
} as const;

export const SOCIAL_LOGIN = {
    KAKAO: '카카오 계정으로 로그인',
    GOOGLE: 'Google 계정으로 로그인',
};
