import { AUTH_KEYS } from '@/constants/auth';

export const getToken = (): string | null => localStorage.getItem(AUTH_KEYS.TOKEN);
export const getUserId = (): string | null => localStorage.getItem(AUTH_KEYS.USER_ID);
