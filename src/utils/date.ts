import { FormattedTripDate, Trip } from '@/types/trip';

export const formatTripDate = (tripsList: Trip[]): FormattedTripDate[] =>
    tripsList?.map((trip) => ({
        ...trip,
        country: trip.country.toUpperCase(),
        startDate: new Date(trip.startDate).toLocaleDateString('ko-KR'),
        endDate: new Date(trip.endDate).toLocaleDateString('ko-KR'),
    }));

// 날짜를 YYYY-MM-DD 형식으로 변환하는 함수
export function formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 날짜를 YYYY년 MM월 DD일 형식으로 변환하는 함수
export function formatDateToKorean(dateString: string): string {
    const [year, month, day] = dateString.split('-');

    if (!year || !month || !day) {
        throw new Error('Invalid date format. Expected YYYY-MM-DD');
    }

    return `${month}월 ${day}일`;
}

export const getDayNumber = (recordDate: string, startDate: string) => {
    if (!recordDate || !startDate) {
        return 'Invalid date'; // recordDate 또는 startDate가 없으면 기본 메시지 반환
    }

    const start = new Date(startDate).getTime();
    const current = new Date(recordDate).getTime();

    // 날짜 차이를 밀리초 단위로 계산한 후 일 단위로 변환
    const diffInTime = current - start;
    const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));

    // Day1부터 시작하므로 1을 더해줌
    return `Day ${diffInDays + 1}`;
};
