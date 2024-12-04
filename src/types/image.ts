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

interface PresignedUploadFileInfo {
    fileName: string;
    fileType: string;
}

interface MediaFileMetadata {
    mediaLink: string;
    latitude: number | null;
    longitude: number | null;
    recordDate: string;
    mediaType: string;
}

interface PresignedUrlResponse {
    fileKey: string;
    presignedPutUrl: string;
}

interface ImageUploadData {
    image: File;
    formattedDate: string;
    location: {
        latitude: number;
        longitude: number;
    };
}
