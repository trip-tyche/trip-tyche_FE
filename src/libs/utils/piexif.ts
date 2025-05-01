import piexif from 'piexifjs';

import { ImageModel } from '@/domains/media/image';
import { GpsCoordinates } from '@/shared/types/location';
// EXIF 데이터의 타입 정의
interface ExifData {
    '0th'?: {
        [key: number]: any;
    };
    GPS?: {
        [key: number]: any;
    };
    [key: string]: any;
}

// 이미지 파일을 읽고 EXIF 데이터를 추출하여 반환하는 함수
const readExifData = (file: File): Promise<ExifData | null> =>
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
// export const readExifData = async (file: File): Promise<ExifData | null> => {
//     if (isHEIC(file)) {
//         file = await convertHEICToJPEG(file);
//     }

//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();

//         reader.onload = (e: ProgressEvent<FileReader>) => {
//             const result = e.target?.result;

//             if (typeof result === 'string') {
//                 try {
//                     const exif = piexif.load(result);
//                     resolve(exif);
//                 } catch (error) {
//                     console.error('Error loading EXIF data:', error);
//                     resolve(null);
//                 }
//             } else {
//                 reject(new Error('Failed to read image file as string'));
//             }
//         };

//         reader.readAsDataURL(file);
//         reader.onerror = (error) => reject(error);
//     });
// };

// DMS (도, 분, 초) 형식의 GPS 데이터를 DD (십진수) 형식으로 변환하는 함수
const convertDMSToDD = (degrees: number, minutes: number, seconds: number, direction: string): number => {
    let dd = degrees + minutes / 60 + seconds / 3600; // DMS 형식을 DD 형식으로 변환하는 공식
    if (direction === 'S' || direction === 'W') {
        dd = dd * -1;
    }
    return dd;
};

// EXIF 데이터를 기반으로 GPS 좌표를 추출하는 함수
const extractGpsData = (exifObj: any): GpsCoordinates | null => {
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

// 이미지에서 위치 추출 함수
export const getImageLocation = async (file: File): Promise<GpsCoordinates | null> => {
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
            parseInt(month) - 1, // JavaScript의 월은 0-based
            parseInt(day),
            parseInt(hour),
            parseInt(minute),
            parseInt(second),
        );
    } catch (error) {
        console.error('Error extracting date from image:', error);
        return null;
    }
};

// ///////////////////////////////////////
// 메타데이터 업데이트
export const addGpsMetadataToImages = async (imagesToUpdate: ImageModel[], gpsLocation: GpsCoordinates) =>
    await Promise.all(
        imagesToUpdate.map(async (image) => {
            const currentExifData = piexif.load(await readFileAsDataURL(image.image));
            const gpsExifData = createGpsExif(gpsLocation.latitude, gpsLocation.longitude);

            const mergedExifData = { ...currentExifData, ...gpsExifData };
            const serializedExif = piexif.dump(mergedExifData);

            const imageBlobWithGps = await insertExifIntoJpeg(image.image, serializedExif);
            return {
                image: new File([imageBlobWithGps], image.image.name, { type: image.image.type }),
                formattedDate: image.formattedDate,
                location: image.location,
            };
        }),
    );

// 원본 이미지에 새로운 EXIF 데이터(직렬화된 문자열)를 삽입
const insertExifIntoJpeg = async (file: File, exifStr: string): Promise<Blob> => {
    const dataUrl = await readFileAsDataURL(file);
    const newDataUrl = piexif.insert(exifStr, dataUrl);
    const base64 = newDataUrl.split(',')[1];
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
    }
    return new Blob([array], { type: file.type });
};

// 아래부분이 위치 추가
const createGpsExif = (lat: number, lng: number): Pick<ExifData, 'GPS'> => {
    const latRef = lat >= 0 ? ('N' as const) : ('S' as const);
    const lngRef = lng >= 0 ? ('E' as const) : ('W' as const);

    const latDeg = Math.abs(lat);
    const lngDeg = Math.abs(lng);

    const latDMS = piexif.GPSHelper.degToDmsRational(latDeg);
    const lngDMS = piexif.GPSHelper.degToDmsRational(lngDeg);

    return {
        GPS: {
            [piexif.GPSIFD.GPSLatitudeRef]: latRef,
            [piexif.GPSIFD.GPSLatitude]: latDMS,
            [piexif.GPSIFD.GPSLongitudeRef]: lngRef,
            [piexif.GPSIFD.GPSLongitude]: lngDMS,
        },
    };
};

// 이미지 파일을 DataURL 형식으로 변환
const readFileAsDataURL = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
    });
