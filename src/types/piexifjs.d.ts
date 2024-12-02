declare module 'piexifjs' {
    export const GPSIFD: {
        GPSLatitudeRef: 1;
        GPSLatitude: 2;
        GPSLongitudeRef: 3;
        GPSLongitude: 4;
    };

    export function load(data: string): ExifData;
    export function dump(exif: ExifData): string;
    export function insert(exif: string, jpeg: string): string;
    export function remove(jpeg: string): string;

    export const ImageIFD: Record<string, number>;
    export const ExifIFD: Record<string, number>;
    export const TAGS: Record<string, Record<number, string>>;

    export namespace GPSHelper {
        function degToDmsRational(degFloat: number): [number, number][];
    }

    export interface ExifData {
        '0th': Record<number, unknown>;
        Exif: Record<number, unknown>;
        GPS: {
            [key: number]: unknown;
        } & {
            [GPSIFD.GPSLatitude]?: [number, number][];
            [GPSIFD.GPSLatitudeRef]?: 'N' | 'S';
            [GPSIFD.GPSLongitude]?: [number, number][];
            [GPSIFD.GPSLongitudeRef]?: 'E' | 'W';
        };
        Interop: Record<number, unknown>;
        '1st': Record<number, unknown>;
        thumbnail: null | Uint8Array;
    }
}
