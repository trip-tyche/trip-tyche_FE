import { ImageUploadStepType, MediaFile } from '@/domains/media/types';

/**
 * 기본 위치{latitude: 0, longtitude: 0}가 아닌 유효한 위치를 가진 미디어 파일만 필터링
 * @param mediaFiles 필터링할 미디어 파일 배열
 * @returns 유효한 위치를 가진 미디어 파일 배열
 */
export const filterValidLocationMediaFile = (mediaFiles: MediaFile[]) =>
    mediaFiles.filter((mediaFile: MediaFile) => mediaFile.latitude !== 0 && mediaFile.longitude !== 0);

/**
 * 기본 날짜(1980-01-01)가 아닌 유효한 날짜를 가진 미디어 파일만 필터링
 * @param mediaFiles 필터링할 미디어 파일 배열
 * @returns 유효한 날짜를 가진 미디어 파일 배열
 */
export const filterValidDatePinPoint = (mediaFiles: MediaFile[]) =>
    mediaFiles.filter((mediaFile) => !mediaFile.recordDate.startsWith('1980-01-01'));

export const removeDuplicateDates = (datesString: string[]) =>
    [...new Set<string>([...datesString])].sort((a, b) => a.localeCompare(b));

export const getTitleByStep = (step: ImageUploadStepType) => {
    switch (step) {
        case 'upload':
            return '여행 사진 등록';
        case 'processing':
            return '사진 처리 중';
        case 'review':
            return '정보 확인';
    }
};
