const NICKNAME_REGEX = /^\s*[가-힣a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ]+\s*$/;

export const validateUserNickName = (userNickName: string) => {
    if (!NICKNAME_REGEX.test(userNickName)) {
        return '특수문자나 공백을 사용할 수 없습니다.';
    } else if (userNickName.length < 2 || userNickName.length > 10) {
        return '닉네임을 2~10자로 입력해주세요.';
    }
};
