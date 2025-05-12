import piexif from 'piexifjs';

import { Exif } from '@/shared/types/exif';
import { Location } from '@/shared/types/map';

// 이미지 파일에서 EXIF 데이터 추출
const readExifData = (file: File): Promise<Exif | null> => {
    return new Promise((resolve, reject) => {
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

        reader.readAsDataURL(file);
        reader.onerror = (error) => reject(error);
    });
};

// DMS(도, 분, 초) 형식의 GPS 데이터를 DD(십진수) 형식으로 변환
const convertDMSToDD = (degrees: number, minutes: number, seconds: number, direction: string): number => {
    // DMS 형식을 DD 형식으로 변환
    let dd = degrees + minutes / 60 + seconds / 3600;
    if (direction === 'S' || direction === 'W') {
        dd = dd * -1;
    }
    return dd;
};

// EXIF 데이터에서 GPS 좌표 추출
const extractGpsFromExifData = (exifObj: any): Location | null => {
    if (!exifObj || !exifObj['GPS']) return null;
    const gps = exifObj['GPS'];

    /*
     * GPSLatitude, GPSLatitudeRef: 위도 정보와 그에 해당하는 참조(방향)
     * GPSLongitude, GPSLongitudeRef: 경도 정보와 그에 해당하는 참조(방향)
     */
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
        console.error('EXIF 데이터에서 GPS 좌표 추출 실패: ', error);
        return null;
    }
};

// 이미지에서 위치 추출
export const extractLocationFromImage = async (file: File): Promise<Location | null> => {
    try {
        const exifData = await readExifData(file);
        if (!exifData) return null;

        return extractGpsFromExifData(exifData);
    } catch (error) {
        console.error(`${file.name} 위치 추출 실패: `, error);
        return null;
    }
};

// 이미지에서 날짜 추출
export const extractDateFromImage = async (file: File): Promise<Date | null> => {
    try {
        const exifData = await readExifData(file);
        if (!exifData || !exifData['0th']) return null;

        const dateTimeOriginal = exifData['0th'][piexif.ImageIFD.DateTime];
        if (!dateTimeOriginal) return null;

        // EXIF 날짜 형식 (예: "2023:04:01 12:34:56")을 파싱
        const [datePart, timePart] = dateTimeOriginal.split(' ');
        const [year, month, day] = datePart.split(':');
        const [hour, minute, second] = timePart.split(':');

        return new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            parseInt(hour),
            parseInt(minute),
            parseInt(second),
        );
    } catch (error) {
        console.error(`${file.name} 날짜 추출 실패: `, error);
        return null;
    }
};
