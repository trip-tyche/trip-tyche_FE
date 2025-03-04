import { ENV } from '@/constants/api/config';

const OAUTH_URL = 'oauth2/authorization';

export const OAUTH_CONFIG = {
    PATH: {
        KAKAO: `${ENV.API_BASE_URL}/${OAUTH_URL}/kakao`,
        GOOGLE: `${ENV.API_BASE_URL}/${OAUTH_URL}/google`,
    },
    LABELS: {
        KAKAO: '카카오로 5초안에 시작하기',
        GOOGLE: 'Google 계정으로 시작하기',
    },
    STORAGE_KEYS: {
        TOKEN: 'token',
        USER_ID: 'userId',
    },
} as const;
