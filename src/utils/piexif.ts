import piexif from 'piexifjs';

import { GpsData } from '@/types/image';

// 이미지 파일을 읽고 EXIF 데이터를 추출하여 반환하는 함수
const readExifData = (file: File) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            const result = e.target?.result;

            if (typeof result === 'string') {
                try {
                    const exif = piexif.load(result);
                    resolve(exif);
                } catch (error) {
                    resolve(null);
                }
            } else {
                reject(new Error('Failed to read image file as string'));
            }
        };

        reader.readAsDataURL(file); // 파일을 Base64로 변환한 데이터를 읽는 방식
        reader.onerror = (error) => reject(error);
    });

// DMS (도, 분, 초) 형식의 GPS 데이터를 DD (십진수) 형식으로 변환하는 함수
const convertDMSToDD = (degrees: number, minutes: number, seconds: number, direction: string): number => {
    let dd = degrees + minutes / 60 + seconds / 3600; // DMS 형식을 DD 형식으로 변환하는 공식
    if (direction === 'S' || direction === 'W') {
        dd = dd * -1;
    }
    return dd;
};

// EXIF 데이터를 기반으로 GPS 좌표를 추출하는 함수
const extractGpsData = (exifObj: any): GpsData | null => {
    if (!exifObj || !exifObj['GPS']) return null;

    const gps = exifObj['GPS'];

    // GPSLatitude, GPSLatitudeRef: 위도 정보와 그에 해당하는 참조(방향)
    // GPSLongitude, GPSLongitudeRef: 경도 정보와 그에 해당하는 참조(방향)
    const latData = gps[piexif.GPSIFD.GPSLatitude];
    const latRef = gps[piexif.GPSIFD.GPSLatitudeRef];
    const lonData = gps[piexif.GPSIFD.GPSLongitude];
    const lonRef = gps[piexif.GPSIFD.GPSLongitudeRef];

    if (!latData || !latRef || !lonData || !lonRef) {
        return null;
    }

    try {
        const latitude = convertDMSToDD(
            latData[0][0] / latData[0][1],
            latData[1][0] / latData[1][1],
            latData[2][0] / latData[2][1],
            latRef,
        );
        const longitude = convertDMSToDD(
            lonData[0][0] / lonData[0][1],
            lonData[1][0] / lonData[1][1],
            lonData[2][0] / lonData[2][1],
            lonRef,
        );

        return { latitude, longitude };
    } catch (error) {
        console.error('Error calculating GPS coordinates:', error);
        return null;
    }
};

export const getImageLocation = async (file: File): Promise<GpsData | null> => {
    try {
        const exifData = await readExifData(file);
        if (!exifData) {
            return null;
        }
        return extractGpsData(exifData);
    } catch (error) {
        console.error('Error getting image location for', file.name, ':', error);
        return null;
    }
};
