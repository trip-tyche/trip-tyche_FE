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

export type PinpointMediaModel = Pick<BaseLocationMedia, 'mediaLink' | 'recordDate'>;
