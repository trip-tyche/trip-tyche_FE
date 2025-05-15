import { Location } from '@/shared/types/map';

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

export interface ImagesFiles {
    totalImages: ImageFile[];
    completeImages: ImageFile[];
    imagesWithoutDate: ImageFile[];
    imagesWithoutLocation: ImageFile[];
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
