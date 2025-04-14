type SuccessResponse<T> = { success: true; data: T };
type FailureResponse = { success: false; error: string };

export type Result<T> = SuccessResponse<T> | FailureResponse;
