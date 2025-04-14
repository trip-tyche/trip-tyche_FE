export interface ApiResponse<T> {
    status: number;
    code: number;
    message: string;
    data: T;
    httpStatus: string;
}

type Success<T> = { success: true; data: T };
type Error = { success: false; error: string };

export type Result<T> = Success<T> | Error;
