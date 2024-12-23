import { getToken, getUserId } from '@/utils/auth';

export const validateUserNickName = (userNickName: string) => {
    const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ][가-힣a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ\s]*[가-힣a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ]$/;

    if (userNickName.length < 2 || userNickName.length > 10) {
        return '닉네임을 2~10자로 입력해주세요.';
    } else if (!NICKNAME_REGEX.test(userNickName)) {
        return '특수문자나 시작과 끝에 공백을 사용할 수 없습니다.';
    }
};

export const validateUserAuth = () => {
    const token = getToken();
    const userId = getUserId();

    if (!token || !userId) {
        return false;
    }

    return true;
};
