import { PinPoint } from '@/domains/route/types';

export const filterValidLocationPinPoint = (pinPoints: PinPoint[]) =>
    pinPoints.filter((pinPoint: PinPoint) => pinPoint.latitude !== 0 && pinPoint.longitude !== 0);

export const sortPinPointByDate = (pinPoints: PinPoint[]) =>
    pinPoints.sort((pinPointA: PinPoint, pinPointB: PinPoint) => {
        return new Date(pinPointA.recordDate).getTime() - new Date(pinPointB.recordDate).getTime();
    });
