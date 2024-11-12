type TripIdType = number;
type PinPointIdType = number;

export const PATH = {
    MAIN: '/',
    ONBOARDING: '/onboarding',
    AUTH: {
        LOGIN: '/login',
        LOGIN_REDIRECT: '/auth/redirect',
    },
    SETTING: '/setting',
    TRIPS: {
        ROOT: '/trips',
        NEW: {
            IMAGES: (tripId: TripIdType) => `/trips/${tripId}/new/images`,
            LOCATIONS: (tripId: TripIdType) => `/trips/${tripId}/new/locations`,
            INFO: (tripId: TripIdType) => `/trips/${tripId}/new/info`,
        },
        EDIT: (tripId: TripIdType) => `/trips/${tripId}/edit`,
        TIMELINE: {
            MAP: (tripId: TripIdType) => `/trips/${tripId}/timeline/map`,
            PINPOINT: (tripId: TripIdType, pinPointId: PinPointIdType) =>
                `/trips/${tripId}/timeline/pinpoint/${pinPointId}`,
            DATE: (tripId: TripIdType) => `/trips/${tripId}/timeline/date`,
        },
    },
} as const;

export const PATH_TITLE = {
    MAIN: '메인',
    ONBOARDING: '온보딩',
    AUTH: {
        LOGIN: '로그인',
        LOGIN_REDIRECT: '로그인 리다이렉트',
    },
    SETTING: '설정',
    TRIPS: {
        ROOT: '여행 티켓',
        NEW: {
            IMAGES: '이미지 업로드',
            LOCATIONS: '위치 등록',
            INFO: '여행 정보 등록',
        },
        EDIT: '여행 수정',
        TIMELINE: {
            MAP: '타임라인 지도',
            PINPOINT: '핀포인트',
            DATE: '날짜별 보기',
        },
    },
} as const;
