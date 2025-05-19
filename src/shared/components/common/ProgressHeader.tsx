import { css } from '@emotion/react';

import { COLORS } from '@/shared/constants/style';

interface ProgressHeaderProps {
    currentStep: string;
}

const ProgressHeader = ({ currentStep }: ProgressHeaderProps) => {
    const isActive = (step: string) => {
        const steps = ['upload', 'processing', 'review', 'info'];
        const currentIndex = steps.indexOf(currentStep);
        const stepIndex = steps.indexOf(step);
        return currentIndex >= stepIndex;
    };

    const isCurrent = (step: string) => currentStep === step;

    const getStepStyle = (step: string) => {
        if (isCurrent(step)) {
            return css`
                background-color: #2563eb;
                color: white;
            `;
        } else if (isActive(step)) {
            return css`
                background-color: #16a34a;
                color: white;
            `;
        } else {
            return css`
                background-color: #e5e7eb;
                color: #4b5563;
            `;
        }
    };

    const getConnectorStyle = (afterStep: string) => {
        if (isActive(afterStep)) {
            return css`
                background-color: #16a34a;
            `;
        } else {
            return css`
                background-color: #e5e7eb;
            `;
        }
    };

    if (currentStep === 'complete') return null;

    return (
        <div css={container}>
            <div css={stepAndLink}>
                <div css={[step, getStepStyle('upload')]}>1</div>
                <div css={[link, getConnectorStyle('processing')]}></div>

                <div css={[step, getStepStyle('processing')]}>2</div>
                <div css={[link, getConnectorStyle('review')]}></div>

                <div css={[step, getStepStyle('review')]}>3</div>
                <div css={[link, getConnectorStyle('info')]}></div>

                <div css={[step, getStepStyle('info')]}>4</div>
            </div>

            <div css={stepText}>
                <span>사진 등록</span>
                <span>분석 중</span>
                <span>정보 확인</span>
                <span>정보 입력</span>
            </div>
        </div>
    );
};

const container = css`
    padding: 12px;
    background-color: ${COLORS.BACKGROUND.WHITE};
    border-bottom: 1px solid ${COLORS.BORDER};
    display: flex;
    flex-direction: column;
    align-items: center;
    user-select: none;
`;

const stepAndLink = css`
    width: 95%;
    display: flex;
    align-items: center;
`;

const step = css`
    width: 24px;
    height: 24px;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
`;

const link = css`
    flex: 1;
    height: 4px;
    margin-left: 4px;
    margin-right: 4px;
`;

const stepText = css`
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #6b7280;
    margin-top: 8px;
`;

export default ProgressHeader;
