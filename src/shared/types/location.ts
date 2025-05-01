export interface GpsCoordinates {
    latitude: number;
    longitude: number;
}

export type Location = GpsCoordinates | null;
