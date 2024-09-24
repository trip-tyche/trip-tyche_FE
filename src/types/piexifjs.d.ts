declare module 'piexifjs' {
    export function load(data: string): ExifData;
    export function dump(exif: ExifData): any;
    export function insert(exif: any, jpeg: string): string;
    export function remove(jpeg: string): string;

    export const GPSIFD: {
        GPSLatitudeRef: 1;
        GPSLatitude: 2;
        GPSLongitudeRef: 3;
        GPSLongitude: 4;
        // 다른 GPS 관련 태그들도 필요하다면 여기에 추가
    };

    export const ImageIFD: { [key: string]: number };
    export const ExifIFD: { [key: string]: number };
    export const TAGS: { [key: string]: { [key: number]: string } };

    export namespace GPSHelper {
        function degToDmsRational(degFloat: number): [number, number][];
    }

    export interface ExifData {
        '0th': { [key: number]: any };
        Exif: { [key: number]: any };
        GPS: {
            [key: number]: any;
            [GPSIFD.GPSLatitude]?: [number, number][];
            [GPSIFD.GPSLatitudeRef]?: string;
            [GPSIFD.GPSLongitude]?: [number, number][];
            [GPSIFD.GPSLongitudeRef]?: string;
        };
        Interop: { [key: number]: any };
        '1st': { [key: number]: any };
        thumbnail: null | Uint8Array;
    }
}
