import { UnlocatedMediaFileList } from '@/domains/media/types';

export type ImageGroupByDate = Record<string, UnlocatedMediaFileList[]>;

export interface PresignedUrlRequest {
    fileName: string;
}

export interface PresignedUrlResponse {
    fileKey: string;
    presignedPutUrl: string;
}
