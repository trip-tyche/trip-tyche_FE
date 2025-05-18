import { ImageProcessStatusType, ImageUploadStepType, MediaFile } from '@/domains/media/types';

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
            return '처리된 사진 정보';
    }
};

export const getAlertBoxMessage = (currentProcess: ImageProcessStatusType) => {
    if (currentProcess === 'metadata') {
        return {
            title: '사진 정보 수집 중...',
            description: '소중한 추억의 장소와 날짜를 기억하고 있어요.',
        };
    } else if (currentProcess === 'optimize') {
        return {
            title: '사진 최적화 중...',
            description: '언제 어디서나 쉽게 볼 수 있도록 사진을 가볍게 만들고 있어요.',
        };
    } else if (currentProcess === 'upload') {
        return {
            title: '안전하게 저장 중...',
            description: '소중한 사진을 안전하게 저장하고 있어요.',
        };
    }
    return {
        title: '문제가 발생했나요?',
        description: '새로고침 및 서비스 종료 후 다시 이용해주세요.',
    };
};
