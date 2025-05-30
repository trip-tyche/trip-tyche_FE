import { ClientImageFile, ImageProcessStatusType, ImageUploadStepType, MediaFile } from '@/domains/media/types';
import { getAddressFromLocation } from '@/libs/utils/map';
import { hasValidDate, hasValidLocation } from '@/libs/utils/validate';
import { Location } from '@/shared/types/map';

/**
 * 위치, 날짜 모두 유효한 미디어 파일 필터링
 * @param mediaFiles 필터링할 미디어 파일 배열
 * @returns 위치, 날짜 모두 유효한 미디어 파일 배열
 */
export const filterValidMediaFile = (metadatas: ClientImageFile[] | MediaFile[]) =>
    metadatas.filter(
        (metadata) =>
            hasValidLocation({ latitude: metadata.latitude, longitude: metadata.longitude }) &&
            hasValidDate(metadata.recordDate),
    );

/**
 * 유효하지 않은 위치(기본위치: {latitude: 0, longtitude: 0})를 가진 이미지 파일만 필터링
 * @param mediaFiles 필터링할 미디어 파일 배열
 * @returns 위치 없는 미디어 파일 배열
 */
export const filterWithoutLocationMediaFile = (metadatas: ClientImageFile[] | MediaFile[]) =>
    metadatas.filter(
        (metadata) =>
            !hasValidLocation({ latitude: metadata.latitude, longitude: metadata.longitude }) &&
            hasValidDate(metadata.recordDate),
    );

/**
 * 유효하지 않은 날짜(기본날짜: 1980-01-01)를 가진 미디어 파일만 필터링
 * @param mediaFiles 필터링할 미디어 파일 배열
 * @returns 날짜 없는 미디어 파일 배열
 */
export const filterWithoutDateMediaFile = (metadatas: ClientImageFile[] | MediaFile[]) =>
    metadatas.filter((metadata) => !hasValidDate(metadata.recordDate));

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
        case 'info':
            return '';
        case 'done':
            return '';
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

export const getAddressFromImageLocation = async (location: Location): Promise<string> => {
    const { latitude, longitude } = location;
    const result = await getAddressFromLocation(latitude, longitude);

    if (result.success) {
        return result?.data as string;
    }
    return result.error as string;
};

export const getImageDateFromImage = (images: ClientImageFile[] | null) => {
    if (!images || images?.length === 0) return null;
    const imageDates = images?.map((image: ClientImageFile) => image.recordDate.split('T')[0]);
    const validDates = imageDates.filter((date) => date);

    return removeDuplicateDates(validDates);
};

export const getImageGroupByDate = (images: MediaFile[]) => {
    const group = images.reduce<
        Record<
            string,
            {
                recordDate: string;
                images: MediaFile[];
            }
        >
    >((acc, curr) => {
        const date = curr.recordDate.split('T')[0];

        if (!acc[date]) {
            acc[date] = { recordDate: date, images: [curr] };
        } else {
            acc[date].images = [...acc[date].images, curr];
        }

        return acc;
    }, {});

    return Object.values(group).sort(
        (
            dateA: {
                recordDate: string;
                images: MediaFile[];
            },
            dateB: {
                recordDate: string;
                images: MediaFile[];
            },
        ) => new Date(dateA.recordDate).getTime() - new Date(dateB.recordDate).getTime(),
    );
};
