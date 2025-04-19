export const MESSAGE = {
    NICKNAME_FORM: {
        TITLE: '새로운 닉네임을 입력해주세요 😀',
        PLACEHOLDER: '닉네임은 최대 10자까지 등록할 수 있습니다.',
    },

    LOGOUT_MODAL: {
        TITLE: '로그아웃',
        MESSAGE: '정말 로그아웃 하시겠습니까?',
        CONFIRM_TEXT: '확인',
        CANCEL_TEXT: '취소',
    },

    TRIP_IMAGES_UPLOAD: {
        message: '사진을 업로드해주세요.',
    },

    ERROR: {
        UNKNOWN: '알 수 없는 오류가 발생했습니다',
        NETWORK: '네트워크 연결 상태를 확인해주세요',
        SERVER: '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요',
        TIMEOUT: '요청 시간이 초과되었습니다. 다시 시도해주세요',
    },
} as const;

export const BUTTON = {
    NEW_TRIP: '새로운 티켓 생성',
    NEXT: '다음',
    UPDATE_TRIP: '수정하기',
    LOGOUT: '로그아웃',
    OAUTH: {
        KAKAO: '카카오로 5초안에 시작하기',
        GOOGLE: 'Google 계정으로 시작하기',
    },
} as const;

export const IMAGE_CAROUSEL_STATE = {
    AUTO: 'auto',
    PAUSED: 'paused',
    ZOOMED: 'zoomed',
} as const;
