import { css } from '@emotion/react';
import { ChevronDown } from 'lucide-react';

import theme from '@/styles/theme';
import { getDayNumber } from '@/utils/date';

interface DateSelectorProps {
    currentDate: string;
    availableDates: string[];
    startDate: string;
    onDateSelect: (date: string) => void;
    onArrowButtonClick: () => void;
}

const DateSelector = ({
    currentDate,
    availableDates,
    startDate,
    onDateSelect,
    onArrowButtonClick,
}: DateSelectorProps) => {
    const generateDayList = () => {
        if (!startDate || !availableDates.length) return [];

        return availableDates.map((date) => {
            const dayNumber = getDayNumber(date, startDate);
            return { date, dayNumber };
        });
    };

    return (
        <section css={dateScrollStyle}>
            <div css={buttonGroup}>
                {generateDayList().map(({ date, dayNumber }) => (
                    <button key={date} css={dayButtonStyle(currentDate === date)} onClick={() => onDateSelect(date)}>
                        {dayNumber}
                    </button>
                ))}
            </div>
            <button css={arrowButtonStyle} onClick={onArrowButtonClick}>
                <ChevronDown size={20} color={`${theme.colors.descriptionText}`} strokeWidth={2.5} />
            </button>
        </section>
    );
};

const dateScrollStyle = css`
    display: flex;
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
    &::-webkit-scrollbar {
        display: none;
    }
    flex-grow: 1;
`;

const dayButtonStyle = (isSelected: boolean) => css`
    background: none;
    border: none;
    padding: 8px 16px;
    margin-right: 8px;
    cursor: pointer;
    font-weight: ${isSelected ? 'bold' : 'normal'};
    font-size: ${isSelected ? '18px' : '14px'};
    color: ${isSelected ? theme.colors.primary : theme.colors.darkGray};
    flex-shrink: 0;
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
