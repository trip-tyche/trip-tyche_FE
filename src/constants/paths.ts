type UserId = number;
type TripKey = string;
type PinPointId = number;

export const ROUTES = {
    PATH: {
        MAIN: '/',
        ONBOARDING: '/onboarding',
        AUTH: {
            LOGIN: '/login',
            LOGIN_REDIRECT: '/login/redirect',
        },
        SETTING: '/setting',
        NOTIFICATION: (userId: UserId) => `notification/${userId}`,
        TRIPS: {
            ROOT: '/trips',
            IMAGES: (tripKey: TripKey) => `/trips/${tripKey}/images`,
            NEW: {
                IMAGES: (tripKey: TripKey) => `/trips/${tripKey}/new/images`,
                LOCATIONS: (tripKey: TripKey) => `/trips/${tripKey}/new/locations`,
                INFO: (tripKey: TripKey) => `/trips/${tripKey}/new/info`,
            },
            EDIT: (tripKey: TripKey) => `/trips/${tripKey}/edit`,
            TIMELINE: {
                MAP: (tripKey: TripKey) => `/trips/${tripKey}/timeline/map`,
                PINPOINT: (tripKey: TripKey, pinPointId: PinPointId) =>
                    `/trips/${tripKey}/timeline/pinpoint/${pinPointId}`,
                DATE: (tripKey: TripKey) => `/trips/${tripKey}/timeline/date`,
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
