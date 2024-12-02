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
