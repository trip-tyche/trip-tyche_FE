import { AxiosError } from 'axios';

import { Result } from '@/types/apis/common';

export interface ApiResponse<T> {
    status: number;
    code: number;
    message: string;
    data: T;
    httpStatus: string;
}

export const toResult = async <T>(fn: () => Promise<ApiResponse<T>>): Promise<Result<T>> => {
    try {
        const { data } = await fn();
        return { success: true, data };
    } catch (error) {
        if (error instanceof AxiosError) {
            const errorResponse = error?.response?.data;
            return { success: false, error: errorResponse.message };
        }
        return { success: false, error: '알 수 없는 오류가 발생하였습니다' };
    }
};
