import { TOKEN_KEY, USERID_KEY } from '@/constants/auth';

// 토큰 가져오기
export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

// User ID 가져오기
export const getUserId = (): number | null => {
    const userId = localStorage.getItem(USERID_KEY);
    return userId ? JSON.parse(userId) : null;
};
