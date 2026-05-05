import { Fragment } from 'react';

import { css } from '@emotion/react';
import { Check } from 'lucide-react';

import { COLORS } from '@/shared/constants/style';

interface TripUploadStepperProps {
    step: 0 | 1 | 2;
}

const LABELS = ['사진', '정보', '완료'] as const;

const TripUploadStepper = ({ step }: TripUploadStepperProps) => {
    return (
        <div css={container}>
            {LABELS.map((label, i) => {
                const reached = i <= step;
                const done = i < step;
                return (
                    <Fragment key={label}>
                        <div css={cell}>
                            <div css={dot(reached)}>
                                {done ? <Check size={11} strokeWidth={3.5} color='#fff' /> : i + 1}
                            </div>
                            <span css={text(i === step)}>{label}</span>
                        </div>
                        {i < LABELS.length - 1 && <div css={connector(i < step)} />}
                    </Fragment>
                );
            })}
        </div>
    );
};

const container = css`
    display: flex;
    align-items: center;
    padding: 0 24px;
`;

const cell = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
`;

const dot = (reached: boolean) => css`
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: ${reached ? COLORS.PRIMARY : '#f1f5f9'};
    color: ${reached ? '#fff' : '#94a3b8'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 800;
`;

const text = (current: boolean) => css`
    font-size: 10px;
    font-weight: 600;
    color: ${current ? '#0f172a' : '#cbd5e1'};
    letter-spacing: 0.2px;
`;

const connector = (active: boolean) => css`
    flex: 1;
    height: 1.5px;
    background: ${active ? COLORS.PRIMARY : '#e2e8f0'};
    margin: 0 8px 20px;
`;

export default TripUploadStepper;
