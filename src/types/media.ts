export interface BaseLocationMedia {
    latitude: number;
    longitude: number;
    mediaLink: string;
    recordDate: string;
}

export interface PinPointModel extends BaseLocationMedia {
    pinPointId: number;
}

export interface MediaFileModel extends BaseLocationMedia {
    mediaFileId: string;
    mediaType: string;
}

export interface UnlocatedMediaFile {
    mediaFileId: number;
    mediaLink: string;
}

export interface UnlocatedMediaFileModel {
    recordDate: string;
    media: UnlocatedMediaFile[];
}

export type PinpointMediaModel = Pick<BaseLocationMedia, 'mediaLink' | 'recordDate'>;

export interface MediaFile {
    mediaFileId: string;
    mediaLink?: string;
    recordDate: string;
    latitude: number;
    longitude: number;
}

export interface MediaFileWithDate {
    recordDate: string;
    images: MediaFile[];
}

// TODO: API 수정 후, 위 MediaFileModel, MediaFile 삭제하기
export interface MediaFileMetaData {
    mediaLink: string;
    recordDate: string;
    latitude: number;
    longitude: number;
}
