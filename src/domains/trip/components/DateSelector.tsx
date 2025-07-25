import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { css } from '@emotion/react';
import { useNavigate, useParams } from 'react-router-dom';

import { getDays } from '@/domains/trip/utils';
import { formatToKorean } from '@/libs/utils/date';
import { ROUTES } from '@/shared/constants/route';
import theme from '@/shared/styles/theme';

interface DateSelectorProps {
    selectedDate: string;
    dates: string[];
}

const DateSelector = React.memo(({ selectedDate, dates }: DateSelectorProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

    const { tripKey } = useParams();
    const navigate = useNavigate();

    const scrollToCenter = useCallback((targetDate: string) => {
        const container = scrollContainerRef.current;
        const button = buttonRefs.current.get(targetDate);

        if (!(container && button)) return;

        const containerWidth = container.offsetWidth;
        const buttonLeft = button.offsetLeft;
        const buttonWidth = button.offsetWidth;

        const targetScrollLeft = buttonLeft - containerWidth / 2 + buttonWidth / 2 - 20;

        container.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        if (selectedDate) {
            scrollToCenter(selectedDate);
        }
    }, [selectedDate, scrollToCenter]);

    const days = useMemo(() => getDays(dates), [dates]);

    const handleDateClick = (date: string) => {
        navigate(ROUTES.PATH.TRIP.IMAGE.BY_DATE(tripKey!, date), { replace: true });
    };

    return (
        <div ref={scrollContainerRef} css={buttonGroup}>
            {days.map(({ date, dayNumber }) => (
                <button
                    key={date}
                    ref={(element) => {
                        if (element) {
                            buttonRefs.current.set(date, element);
                        } else {
                            buttonRefs.current.delete(date);
                        }
                    }}
                    css={dayButtonStyle(selectedDate === date)}
                    onClick={() => handleDateClick(date)}
                >
                    <h3>{dayNumber}</h3>
                    <p>{formatToKorean(date)}</p>
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
