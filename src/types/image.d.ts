export interface ImageWithLocation {
    file: File;
    location: GpsData | null;
}

export interface GpsData {
    latitude: number;
    longitude: number;
}
