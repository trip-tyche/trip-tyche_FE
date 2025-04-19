import { MediaFile } from '@/domain/media/types';
import { PinPoint } from '@/domain/route/types';
// import { Trip } from '@/domain/trip/types';

type Success<T> = { success: true; data: T };
type Error = { success: false; error: string };

export type Result<T> = Success<T> | Error;

export interface ApiResponse<T> {
    status: number;
    code: number;
    message: string;
    data: T;
    httpStatus: string;
}

export interface RouteResponse {
    tripTitle: string;
    startDate: string;
    endDate: string;
    mediaFiles: MediaFile[];
    pinPoints: PinPoint[];
}

// export interface ShareDetailResponse extends Trip {}
