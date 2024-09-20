// 토큰 가져오기
export const getToken = (): string | null => localStorage.getItem('token');

// User ID 가져오기
export const getUserId = (): string | null => localStorage.getItem('userId');
