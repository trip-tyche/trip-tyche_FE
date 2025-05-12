import { PinPoint } from '@/domains/route/types';

/**
 * 기본 위치{latitude: 0, longtitude: 0}가 아닌 유효한 위치를 가진 핀포인트만 필터링
 * @param mediaFiles 필터링할 핀포인트 배열
 * @returns 유효한 위치를 가진 핀포인트 배열
 */
export const filterValidLocationPinPoint = (pinPoints: PinPoint[]) =>
    pinPoints.filter((pinPoint: PinPoint) => pinPoint.latitude !== 0 && pinPoint.longitude !== 0);

export const sortPinPointByDate = (pinPoints: PinPoint[]) =>
    pinPoints.sort((pinPointA: PinPoint, pinPointB: PinPoint) => {
        return new Date(pinPointA.recordDate).getTime() - new Date(pinPointB.recordDate).getTime();
    });
