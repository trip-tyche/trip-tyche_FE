export interface GpsData {
    latitude: number;
    longitude: number;
}

export interface ImageModel {
    image: File;
    formattedDate: string;
    location: GpsData | null;
}
