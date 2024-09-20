// 여행정보
export interface TripInfo {
    tripTitle: string;
    country: string;
    startDate: string;
    endDate: string;
    hashtags: string[];
}

// 여행
export interface Trip extends TripInfo {
    readonly tripId: string;
}

// startDate, endDate 타입 재정의를 위한 Omit 유틸리티 타입 사용 (기존 Date 타입)
export interface FormattedTrip extends Omit<Trip, 'startDate' | 'endDate'> {
    startDate: string;
    endDate: string;
}

// 여행 목록
export interface Trips {
    readonly userNickName: string;
    readonly trips: Trip[];
}

// 핀포인트
export interface PinPoint {
    tripId: string;
    pinPointId: string;
    latitude: number;
    longitude: number;
}
