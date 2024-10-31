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
