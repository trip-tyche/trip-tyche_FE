import { MediaFile } from '@/domains/media/types';

/**
 * 기본 날짜(1900-01-01)가 아닌 유효한 날짜를 가진 미디어 파일만 필터링
 * @param mediaFiles 필터링할 미디어 파일 배열
 * @returns 유효한 날짜를 가진 미디어 파일 배열
 */
export const filterValidDatePinPoint = (mediaFiles: MediaFile[]) =>
    mediaFiles.filter((mediaFile) => !mediaFile.recordDate.startsWith('1900-01-01'));
