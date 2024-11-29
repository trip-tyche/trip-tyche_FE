// 여행정보

export interface TripFormData {
    imageDates?: string[];
    tripTitle: string;
    country: string;
    startDate: string;
    endDate: string;
    hashtags: string[];
}

// 여행
export interface Trip extends TripInfoModel {
    readonly tripId: string;
}

// startDate, endDate 타입 재정의를 위한 Omit 유틸리티 타입 사용 (기존 Date 타입)
export interface FormattedTripDate extends Omit<Trip, 'startDate' | 'endDate'> {
    startDate: string;
    endDate: string;
}

// 여행 목록
export interface Trips {
    readonly userNickName: string;
    readonly trips: Trip[];
}

// ////////////////
export interface TripInfoModel {
    tripTitle: string;
    country: string;
    startDate: string;
    endDate: string;
    hashtags: string[];
}

export interface CountryOptionModel {
    emoji: string;
    nameKo: string;
    nameEn: string;
    value: string;
}

export interface BaseLocationMedia {
    latitude: number;
    longitude: number;
    mediaLink: string;
    recordDate: string;
}

export interface PinPoint extends BaseLocationMedia {
    pinPointId: number;
}

export interface MediaFile extends BaseLocationMedia {
    mediaFileId: string;
    mediaType: string;
}
