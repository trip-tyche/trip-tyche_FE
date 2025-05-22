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

export interface ImageFileWithAddress extends MetaData {
    imageUrl: string;
    address: string;
}

// export interface ClientImageFile {
//     image: File;
//     recordDate: string;
//     location: Location | null;
// }

// export interface ImageFile {
//     image: File;
//     recordDate: string;
//     location: Location | null;
// }

// export type MediaFileWithAddress = MediaFile;

// export interface ImageWithAddress {
//     id: string;
//     imageUrl: string;
//     recordDate: string;
//     address: string;
// }

// export interface ImageCount {
//     withAll: number;
//     withoutDate: number;
//     withoutLocation: number;
// }

export interface PresignedUrlResponse {
    fileKey: string;
    presignedPutUrl: string;
}

export interface UnlocatedMediaFile {
    mediaFileId: number;
    mediaLink: string;
}

export interface UnlocatedMediaFileList {
    recordDate: string;
    media: UnlocatedMediaFile[];
}
