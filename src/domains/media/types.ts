import { Location } from '@/shared/types/map';

export type ImageUploadStepType = 'upload' | 'processing' | 'review' | 'info' | 'done';
export type ImageProcessStatusType = 'metadata' | 'optimize' | 'upload';

export interface MediaFile {
    mediaFileId: string;
    latitude: number;
    longitude: number;
    mediaLink: string;
    recordDate: string;
}

export interface ImageFile {
    image: File;
    recordDate: string;
    location: Location | null;
}

export interface ImageWithAddress {
    imageUrl: string;
    recordDate: string;
    address: string;
}

export interface ImageCount {
    total: number;
    withoutDate: number;
    withoutLocation: number;
}

export interface UnlocatedMediaFile {
    mediaFileId: number;
    mediaLink: string;
}

export interface UnlocatedMediaFileList {
    recordDate: string;
    media: UnlocatedMediaFile[];
}

// export type ImageGroupByDate = Record<string, UnlocatedMediaFileList[]>;

export interface PresignedUrlResponse {
    fileKey: string;
    presignedPutUrl: string;
}

//----------------------------------

export interface MediaFileWithDate {
    recordDate: string;
    images: MediaFileMetaData[];
}

// TODO: API 수정 후, 위 MediaFileModel, MediaFile 삭제하기
export interface MediaFileMetaData {
    mediaFileId: string;
    recordDate: string;
    latitude: number;
    longitude: number;
    mediaLink: string;
}
