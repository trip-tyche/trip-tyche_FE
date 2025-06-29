import { MAP } from '@/shared/constants/ui';
import { Location } from '@/shared/types/map';

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
export const getAddressFromLocation = async (location: Location): Promise<string> => {
    const { latitude, longitude } = location;
    const cacheKey = `${latitude}-${longitude}`;

    if (cacheKey === '0-0') return '';

    if (addressCache.has(cacheKey)) {
        return addressCache.get(cacheKey)!;
    }

    const address = await convertLocationToAddress(latitude, longitude);
    addressCache.set(cacheKey, address);
    return address;
};

/**
 * 지리 좌표(latitude, longitude)를 기준으로 주소 반환
 * @param latitude 위도
 * @param longitude 경도
 * @returns 주소 (실패시 빈 문자열)
 */
const convertLocationToAddress = async (latitude: number, longitude: number): Promise<string> => {
    try {
        const geocoder = new google.maps.Geocoder();

        const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
            geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (result, status) => {
                if (status === 'OK' && result) {
                    resolve(result);
                } else {
                    reject(new Error(`Geocoding failed: ${status}`));
                }
            });
        });

        const CITY_INDEX = result.length - 2;
        return CITY_INDEX >= 0 ? result[CITY_INDEX].formatted_address : '주소 특정 불가 지역';
    } catch (error) {
        console.error(error);
        return '위치 정보 없음';
    }
};
