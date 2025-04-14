import { AxiosError } from 'axios';

import { ApiResponse, Result } from '@/api/types';

export const toResult = async <T>(
    fn: () => Promise<ApiResponse<T>>,
    callback?: {
        onSuccess?: () => void;
        onError?: () => void;
        onFinally?: () => void;
    },
): Promise<Result<T>> => {
    const { onSuccess, onError, onFinally } = callback || {};

    try {
        const { data } = await fn();
        onSuccess?.();
        return { success: true, data };
    } catch (error) {
        if (error instanceof AxiosError) {
            const errorResponse = error?.response?.data;
            onError?.();
            return { success: false, error: errorResponse.message };
        }
        return { success: false, error: '알 수 없는 오류가 발생하였습니다' };
    } finally {
        onFinally?.();
    }
};
