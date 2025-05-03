import { UnlocatedMediaFileModel } from '@/domains/media/types';

export type ImageGroupByDate = Record<string, UnlocatedMediaFileModel[]>;

export interface PresignedUrlRequest {
    fileName: string;
}

export interface PresignedUrlResponse {
    fileKey: string;
    presignedPutUrl: string;
}
