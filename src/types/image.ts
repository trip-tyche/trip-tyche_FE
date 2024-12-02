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
