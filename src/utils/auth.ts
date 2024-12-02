import { OAUTH_CONFIG } from '@/constants/api/oauth';

export const getToken = (): string | null => localStorage.getItem(OAUTH_CONFIG.STORAGE_KEYS.TOKEN);
export const getUserId = (): string | null => localStorage.getItem(OAUTH_CONFIG.STORAGE_KEYS.USER_ID);
