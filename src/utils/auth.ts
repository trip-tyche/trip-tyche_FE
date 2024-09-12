import { TOKEN_KEY, USERID_KEY } from '@/constants/auth';

// 토큰 가져오기
export const getToken = (): string | null => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
        throw new Error('로컬 스토리지에서 토큰을 찾을 수 없습니다.');
    }

    return token;
};

// User ID 가져오기
export const getUserId = (): string | null => {
    const userId = localStorage.getItem(USERID_KEY);

    if (!userId) {
        throw new Error('로컬 스토리지에서 유저 ID를 찾을 수 없습니다.');
    }

    return JSON.parse(userId);
};
