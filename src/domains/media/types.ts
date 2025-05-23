import { Location } from '@/shared/types/map';

export type ImageUploadStepType = 'upload' | 'processing' | 'review' | 'info' | 'done';
export type ImageProcessStatusType = 'metadata' | 'optimize' | 'upload';

interface MetaData extends Location {
    recordDate: string;
}

export interface MediaFile extends MetaData {
    mediaFileId: string;
    mediaLink: string;
}

export interface MediaFileCategories {
    withAll: {
        count: number;
        images?: MediaFile[];
    };
    withoutLocation: {
        count: number;
        images?: MediaFile[];
    };
    withoutDate: {
        count: number;
        images?: MediaFile[];
    };
}

export interface ClientImageFile extends MetaData {
    image: File;
}

export interface ImageFileWithAddress extends MediaFile {
    address: string;
}

export interface PresignedUrlResponse {
    fileKey: string;
    presignedPutUrl: string;
}
