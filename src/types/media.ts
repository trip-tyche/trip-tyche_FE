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
