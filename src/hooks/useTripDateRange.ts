import { Dispatch, SetStateAction, useState } from 'react';

import { DateValue, DatesRangeValue } from '@mantine/dates';
import 'dayjs/locale/ko';
import dayjs from 'dayjs';

import theme from '@/styles/theme';
import { TripInfoModel } from '@/types/trip';

interface UseTripDateRangeProps {
    imageDates: string[];
    setTripInfo: Dispatch<SetStateAction<TripInfoModel>>;
    isEditing: boolean;
}

export const useTripDateRange = ({ imageDates, setTripInfo, isEditing }: UseTripDateRangeProps) => {
    const [dateRange, setDateRange] = useState<DatesRangeValue>([null, null]);
    const [selectedDate, setSelectedDate] = useState<DateValue>(null);
    const [isInitialized, setIsInitialized] = useState(true);
    const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [isError, setIsError] = useState(false);

    const handleRangeDateChange = (value: DatesRangeValue) => {
        setDateRange(value);

        // 처음으로 날짜를 선택할 때 초기화 상태 해제
        if (isInitialized && value[0]) {
            setIsInitialized(false);
        }

        // 초기화 상태가 해제된 후에만 선택 로직 실행
        if (!isInitialized) {
            if (value[0] && !value[1]) {
                const startDateString = dayjs(value[0]).format('YYYY-MM-DD');
                setTripInfo((prev: TripInfoModel) => ({ ...prev, startDate: startDateString }));
                setIsSelectMode(true);
                setIsError(false);
            } else if (value[0] && value[1]) {
                const date1 = dayjs(value[0]);
                const date2 = dayjs(value[1]);

                const startDateString = date1.isBefore(date2) ? date1.format('YYYY-MM-DD') : date2.format('YYYY-MM-DD');
                const endDateString = date1.isBefore(date2) ? date2.format('YYYY-MM-DD') : date1.format('YYYY-MM-DD');

                setTripInfo((prev: TripInfoModel) => ({ ...prev, startDate: startDateString, endDate: endDateString }));
                setIsSelectMode(false);

                const hasOutsideImages = imageDates.some((imageDate) => {
                    const date = dayjs(imageDate);
                    return date.isBefore(startDateString) || date.isAfter(endDateString);
                });

                setIsError(hasOutsideImages);
            }
        }
    };

    const handleSingleDateChange = (value: DateValue) => {
        const dateString = dayjs(value).format('YYYY-MM-DD');

        setSelectedDate(value);
        setTripInfo((prev: TripInfoModel) => ({ ...prev, startDate: dateString, endDate: dateString }));

        const hasOutsideImages = imageDates.some((imageDate) => {
            const date = dayjs(imageDate);
            return !date.isSame(dateString, 'day');
        });

        setIsError(hasOutsideImages);
    };

    const handleDateMouseEnter = (date: Date) => {
        if (isInitialized) return;
        if (isStartOrEndDate(date)) {
            return;
        }
        if (isSelectMode) {
            setHoveredDate(date);
        }
    };

    const handleDateMouseLeave = () => {
        if (isSelectMode) {
            setHoveredDate(null);
        }
    };

    const isInRange = (date: Date) => {
        if (!dateRange[0]) return false;

        // 시작일 또는 종료일인 경우 범위에서 제외
        if (dateRange[0] && date.getTime() === dateRange[0].getTime()) return false;
        if (dateRange[1] && date.getTime() === dateRange[1].getTime()) return false;

        // 선택 모드일 때는 첫 선택과 호버 사이의 범위
        if (isSelectMode && hoveredDate) {
            const start = dateRange[0].getTime();
            const end = hoveredDate.getTime();
            const current = date.getTime();
            return (current >= start && current <= end) || (current <= start && current >= end);
        }

        // 선택 모드가 아닐 때는 선택된 두 날짜 사이의 범위
        if (!isSelectMode && dateRange[1]) {
            const start = dateRange[0].getTime();
            const end = dateRange[1].getTime();
            const current = date.getTime();
            return current > start && current < end;
        }

        return false;
    };

    const isStartOrEndDate = (date: Date) =>
        // dateRange뿐만 아니라 defaultStartDate, defaultEndDate도 체크
        (dateRange[0] && date.getTime() === dateRange[0].getTime()) ||
        (dateRange[1] && date.getTime() === dateRange[1].getTime());

    const isSelectedDay = (date: Date, type: 'range' | 'single') => {
        if (type === 'range') {
            return isStartOrEndDate(date);
        }
        return selectedDate && dayjs(date).isSame(selectedDate, 'day');
    };

    const getCustomDayProps = (date: Date, handleDateMouseEnter: (date: Date) => void, type: 'range' | 'single') => {
        const baseProps = {
            onMouseEnter: () => handleDateMouseEnter(date),
        };

        if (type === 'range') {
            return {
                ...baseProps,
                style: {
                    ...(isStartOrEndDate(date)
                        ? { backgroundColor: theme.colors.primary, color: 'white' }
                        : isInRange(date)
                          ? { backgroundColor: '#3d4e8117' }
                          : {}),
                },
            };
        }

        return {
            ...baseProps,
            style: {
                ...(isSelectedDay(date, 'single') ? { backgroundColor: theme.colors.primary, color: 'white' } : {}),
            },
        };
    };

    const resetDates = () => {
        setDateRange([null, null]);
        setSelectedDate(null);
        setHoveredDate(null);
        setIsSelectMode(false);
        setIsError(false);
        setIsInitialized(true);
        setTripInfo((prev: TripInfoModel) => ({
            ...prev,
            startDate: '',
            endDate: '',
        }));
    };

    return isEditing
        ? null
        : {
              dateRange,
              selectedDate,
              hoveredDate,
              isSelectMode,
              isError,
              isInitialized,
              resetDates,
              isSelectedDay,
              handleRangeDateChange,
              handleSingleDateChange,
              handleDateMouseEnter,
              handleDateMouseLeave,
              isInRange,
              isStartOrEndDate,
              getCustomDayProps,
          };
};
