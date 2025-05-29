import { MAP } from '@/shared/constants/ui';

/**
 * 포토카드 위치 변경을 위한 오프셋 계산
 * @param height 변경할 높이
 * @returns 계산된 오프셋
 */
export const getPixelPositionOffset = (height: number) => {
    const offset = {
        x: -MAP.PHOTO_CARD_SIZE.WIDTH / 2,
        y: -(MAP.PHOTO_CARD_SIZE.HEIGHT + height),
    };

    return offset;
};

const addressCache = new Map();

/**
 * 주소 변환 성공 여부에 따라 Result 패턴 적용
 * @param latitude 위도
 * @param longitude 경도
 * @returns Result 패턴이 적용된 주소
 */
export const getAddressFromLocation = async (
    latitude: number,
    longitude: number,
): Promise<{ success: boolean; data?: string; error?: string }> => {
    const cacheKey = `${latitude}-${longitude}`;
    if (addressCache.has(cacheKey)) {
        return addressCache.get(cacheKey);
    }
    try {
        addressCache.set(cacheKey, `${latitude}-${longitude}`);
        return { success: true, data: (await convertLocationToAddress(latitude, longitude)) as string };
    } catch (error) {
        console.error(error);
        return { success: false, error: '' };
    }
};

/**
 * 지리 좌표(latitude, longitude)를 기준으로 주소 반환
 * @param latitude 위도
 * @param longitude 경도
 * @returns 주소
 */
const convertLocationToAddress = (latitude: number, longitude: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder();

        geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (result, status) => {
            if (result && status === 'OK') {
                const CITY_INDEX = result?.length - 2;
                resolve(String(result[CITY_INDEX].formatted_address));
            } else {
                reject('geocoder convert error');
            }
        });
    });
};
