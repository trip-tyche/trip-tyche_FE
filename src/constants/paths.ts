type TripIdType = number;
type PinPointIdType = number;

export const ROUTES = {
    PATH: {
        MAIN: '/',
        ONBOARDING: '/onboarding',
        AUTH: {
            LOGIN: '/login',
            LOGIN_REDIRECT: '/login/redirect',
        },
        SETTING: '/setting',
        SHARE: '/share',
        TRIPS: {
            ROOT: '/trips',
            IMAGES: (tripId: TripIdType) => `/trips/${tripId}/images`,
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
    },
    PATH_TITLE: {
        MAIN: '메인',
        ONBOARDING: '온보딩',
        AUTH: {
            LOGIN: '로그인',
            LOGIN_REDIRECT: '로그인 리다이렉트',
        },
        SETTING: '설정',
        TRIPS: {
            ROOT: '여행 리스트',
            NEW: {
                IMAGES: '여행 사진 관리',
                LOCATIONS: '위치 등록',
                INFO: '여행 정보 입력',
            },
            EDIT: '여행 티켓 수정',
            TIMELINE: {
                MAP: '타임라인 지도',
                PINPOINT: '핀포인트',
                DATE: '날짜별 보기',
            },
        },
    },
} as const;
