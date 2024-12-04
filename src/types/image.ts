import { Location } from '@/types/location';

export interface ImageModel {
    image: File;
    formattedDate: string;
    location: Location;
}

export interface ImageCarouselModel {
    mediaFileId: string;
    mediaLink: string;
}

export type ImageGroupByDate = Record<string, ImageModel[]>;

export interface PresignedUrlRequest {
    fileName: string;
    fileType: string;
}
export interface PresignedUrlResponse {
    fileKey: string;
    presignedPutUrl: string;
}
