import { useCallback, useEffect, useRef } from 'react';

import { css } from '@emotion/react';
import { ChevronDown } from 'lucide-react';

import theme from '@/styles/theme';
import { formatDateToKorean, getDayNumber } from '@/utils/date';

interface DateSelectorProps {
    currentDate: string;
    datesWithImages: string[];
    startDate: string;
    onDateSelect: (date: string) => void;
    onArrowButtonClick: () => void;
}

const DateSelector = ({
    currentDate,
    datesWithImages,
    startDate,
    onDateSelect,
    onArrowButtonClick,
}: DateSelectorProps) => {
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
        <section css={dateSelectorStyle}>
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
            <button css={arrowButtonStyle} onClick={onArrowButtonClick}>
                <ChevronDown size={20} color={`${theme.colors.descriptionText}`} strokeWidth={2.5} />
            </button>
        </section>
    );
};

const dateSelectorStyle = css`
    display: flex;
    justify-content: space-between;
    background-color: ${theme.colors.white};
    height: ${theme.heights.tall_54};
    padding: 8px 20px 8px 8px;
`;

const buttonGroup = css`
    display: flex;
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
        color: ${isSelected ? theme.colors.primary : theme.colors.darkGray};
    }

    p {
        font-size: ${theme.fontSizes.xsmall_10};
        color: ${theme.colors.descriptionText};
    }
`;

const arrowButtonStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
`;

export default DateSelector;
