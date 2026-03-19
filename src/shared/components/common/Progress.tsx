import { css } from '@emotion/react';

import { COLORS } from '@/shared/constants/style';

type SizeType = 'lg' | 'sm';

interface ProgessProps {
    title: string;
    count: number;
    size?: SizeType;
}

const Progress = ({ title, count, size = 'sm' }: ProgessProps) => {
    return (
        <div css={container}>
            <div css={label(size)}>
                <span>{title}</span>
                <span>{count}%</span>
            </div>

            <div css={bar}>
                <div css={getStepProgressFillStyle(count, count === 100, size)} />
            </div>
        </div>
    );
};

const container = css`
    display: flex;
    flex-direction: column;
`;

const label = (size: SizeType) => css`
    display: flex;
    justify-content: space-between;
    font-size: ${size === 'sm' ? '12px' : '14px'};
    color: ${COLORS.TEXT.DESCRIPTION};
    margin-bottom: 6px;
`;

const bar = css`
    height: 6px;
    background-color: ${COLORS.DISABLED};
    border-radius: 9999px;
    overflow: hidden;
`;

const getStepProgressFillStyle = (percentage: number, completed: boolean, size: SizeType) => css`
    width: ${percentage}%;
    height: 100%;
    border-radius: 9999px;
    background-color: ${size === 'lg' ? COLORS.PROGRESS.BLUE : completed ? COLORS.PROGRESS.GREEN : COLORS.PROGRESS.BLUE};
    transition: width 0.3s ease;
`;

export default Progress;
