import React, { useCallback, useEffect, useRef } from 'react';

import { css } from '@emotion/react';

import theme from '@/styles/theme';
import { formatDateToKorean, getDayNumber } from '@/utils/date';

interface DateSelectorProps {
    currentDate: string;
    datesWithImages: string[];
    startDate: string;
    onDateSelect: (date: string) => void;
}

const DateSelector = React.memo(({ currentDate, datesWithImages, startDate, onDateSelect }: DateSelectorProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

    const generateDayList = useCallback(() => {
        if (!startDate || !datesWithImages.length) {
            return [];
        }

        return datesWithImages.map((date) => ({ date, dayNumber: getDayNumber(date, startDate) }));
    }, [datesWithImages, startDate]);

    const scrollToCenter = useCallback((targetDate: string) => {
        const container = scrollContainerRef.current;
        const button = buttonRefs.current.get(targetDate);

        if (!(container && button)) {
            return;
        }

        const containerWidth = container.offsetWidth;
        const buttonLeft = button.offsetLeft;
        const buttonWidth = button.offsetWidth;

        const targetScrollLeft = buttonLeft - containerWidth / 2 + buttonWidth / 2 - 20;

        container.scrollTo({
            left: targetScrollLeft,
            behavior: 'smooth',
        });
    }, []);

    useEffect(() => {
        if (currentDate) {
            scrollToCenter(currentDate);
        }
    }, [currentDate, scrollToCenter]);

    return (
        <div ref={scrollContainerRef} css={buttonGroup}>
            {generateDayList().map(({ date, dayNumber }) => (
                <button
                    key={date}
                    ref={(element) => {
                        if (element) {
                            buttonRefs.current.set(date, element);
                        } else {
                            buttonRefs.current.delete(date);
                        }
                    }}
                    css={dayButtonStyle(currentDate === date)}
                    onClick={() => onDateSelect(date)}
                >
                    <h3>{dayNumber}</h3>
                    <p>{formatDateToKorean(date)}</p>
                </button>
            ))}
        </div>
    );
});

const buttonGroup = css`
    display: flex;
    background-color: ${theme.COLORS.BACKGROUND.WHITE};
    height: 54px;
    padding: 8px;
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
    scroll-behavior: smooth;
    &::-webkit-scrollbar {
        display: none;
    }
`;

const dayButtonStyle = (isSelected: boolean) => css`
    background: none;
    border: none;
    padding: 4px 16px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;

    h3 {
        font-weight: bold;
        color: ${isSelected ? theme.COLORS.PRIMARY : theme.COLORS.TEXT.DESCRIPTION_LIGHT};
    }

    p {
        font-size: ${theme.FONT_SIZES.XS};
        color: ${theme.COLORS.TEXT.DESCRIPTION};
    }
`;

export default DateSelector;
