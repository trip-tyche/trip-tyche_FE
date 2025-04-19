import { UnlocatedMediaFileModel } from '@/domains/media/types';
import { Location } from '@/types/location';

export interface ImageModel {
    image: File;
    formattedDate: string;
    location: Location;
}

export type ImageGroupByDate = Record<string, UnlocatedMediaFileModel[]>;

export interface PresignedUrlRequest {
    fileName: string;
}

export interface PresignedUrlResponse {
    fileKey: string;
    presignedPutUrl: string;
}
