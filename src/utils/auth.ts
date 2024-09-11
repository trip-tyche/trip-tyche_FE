import { TOKEN_KEY, USERID_KEY } from '@/constants/auth';

// 토큰 가져오기
export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

// User ID 가져오기
export const getUserId = (): string | null => localStorage.getItem(USERID_KEY);
