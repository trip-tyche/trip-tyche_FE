type UserId = number;
type TripKey = string;
type PinPointId = number;

export const ROUTES = {
    PATH: {
        ONBOARDING: '/onboarding',
        SIGNIN: '/singin',
        MAIN: '/',
        SETTING: '/setting',
        NOTIFICATION: (userId: UserId) => `notification/${userId}`,
        TRIP: {
            ROOT: '/trip',
            MANAGEMENT: {
                IMAGES: (tripKey: TripKey) => `/trip/${tripKey}/images`,
                UPLOAD: (tripKey: TripKey) => `/trip/${tripKey}/images/upload`,
                INFO: (tripKey: TripKey) => `/trip/${tripKey}/info`,
                EDIT: (tripKey: TripKey) => `/trip/${tripKey}/edit`,
            },
            ROUTE: {
                ROOT: (tripKey: TripKey) => `/trip/${tripKey}/route`,

                IMAGE: {
                    BY_PINPOINT: (tripKey: TripKey, pinPointId: PinPointId) =>
                        `/trip/${tripKey}/by-pinpoint/${pinPointId}`,
                    BY_DATE: (tripKey: TripKey, date: string) => `/trip/${tripKey}/by-date/${date}`,
                },
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
