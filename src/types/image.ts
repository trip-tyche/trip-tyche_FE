export interface GpsData {
    latitude: number;
    longitude: number;
}

export type LocationType = GpsData | null;

export interface ImageModel {
    image: File;
    formattedDate: string;
    location: LocationType;
}

export type ImageGroupByDateType = Record<string, ImageModel[]>;

export type CarouselState = 'auto' | 'paused' | 'zoomed';

export interface ImageCarouselModel {
    mediaFileId: string;
    mediaLink: string;
}
