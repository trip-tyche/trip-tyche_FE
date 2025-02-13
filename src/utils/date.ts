// YYYY-MM-DD
export const formatToYYYYMMDD = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

// YYYY년 MM월 DD일
export const formatToKorean = (dateString: string, isIncludeYear = false) => {
    if (!dateString) {
        return;
    }
    const [year, month, day] = dateString.split('-');

    if (!year || !month || !day) {
        return;
    }

    return isIncludeYear ? `${year}년 ${month}월 ${day}일` : `${month}월 ${day}일`;
};

// YYYY.MM.DD
export const formatToDot = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
};

// Date 객체를 ISO 문자열로 변환하는 함수
export const formatToISOLocal = (date: Date): string => {
    if (!date) return '';

    // 현지 시간대의 년, 월, 일, 시, 분, 초 가져오기
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // YYYY-MM-DDTHH:mm:ss 형식으로 조합
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

export const formatDateTime = (isoString: string): string => {
    const date = new Date(isoString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`;
};
