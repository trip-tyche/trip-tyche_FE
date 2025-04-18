export interface MediaFile {
    mediaFileId: number;
    latitude: number;
    longitude: number;
    mediaLink: string;
    recordDate: string;
}

//----------------------------------

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

export interface MediaFileWithDate {
    recordDate: string;
    images: MediaFileMetaData[];
}

// TODO: API 수정 후, 위 MediaFileModel, MediaFile 삭제하기
export interface MediaFileMetaData {
    mediaFileId: string;
    mediaLink: string;
    recordDate: string;
    latitude: number;
    longitude: number;
}
