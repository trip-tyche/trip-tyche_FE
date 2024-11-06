// 여행정보
export interface TripInfo {
    tripId?: string;
    tripTitle: string;
    country: string;
    startDate: string;
    endDate: string;
    hashtags: string[];
}

export interface TripFormData {
    tripTitle: string;
    country: string;
    startDate: string;
    endDate: string;
    imageDates?: string[];
    hashtags: string[];
}

export interface TripFormHandlers {
    setTripTitle: Dispatch<SetStateAction<string>>;
    setCountry: Dispatch<SetStateAction<string>>;
    setStartDate: Dispatch<SetStateAction<string>>;
    setEndDate: Dispatch<SetStateAction<string>>;
    setHashtags: Dispatch<SetStateAction<string[]>>;
}

export interface TripFormProps extends TripFormData, TripFormHandlers {}

export interface TripEditFormProps extends TripFormData, TripFormHandlers {
    handleInputChange: () => void;
    handleHashtagToggle: () => void;
    handleUpdateTripInfo: () => void;
}

// 여행
export interface Trip extends TripInfo {
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

// 핀포인트
export interface PinPoint {
    tripId: string;
    pinPointId: string;
    latitude: number;
    longitude: number;
    mediaLink: string;
    recordDate: string;
}

// 미디어파일
export interface MediaFile {
    latitude: number;
    longitude: number;
    mediaFileId: string;
    mediaLink: string;
    recordDate: string;
}
