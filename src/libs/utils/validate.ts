import { TripInfo } from '@/domains/trip/types';
import { Location } from '@/shared/types/location';

// 사용자 닉네임 유효성 검사
export const validateUserNickName = (userNickName: string) => {
    const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ][가-힣a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ\s]*[가-힣a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ]$/;

    if (userNickName.length < 2 || userNickName.length > 10) {
        return '닉네임을 2~10자로 입력해주세요.';
    } else if (!NICKNAME_REGEX.test(userNickName)) {
        return '특수문자나 시작과 끝에 공백을 사용할 수 없습니다.';
    }
};

// 폼의 모든 필드에 입력했는지 검사
export const validateFormComplete = (form: TripInfo) =>
    Object.entries(form).every(([_, value]) => (Array.isArray(value) ? value.length > 0 : Boolean(value)));

// 유효한 날짜인지 검사
export const hasValidLocation = (location: Location | null): boolean => location !== null;
