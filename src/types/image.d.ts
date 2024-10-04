export interface ImageWithLocation {
    file: File;
    location: GpsData | null;
}

export interface ImageWithLocationAndDate extends ImageWithLocation {
    formattedDate: string;
}

export interface GpsData {
    latitude: number;
    longitude: number;
}
