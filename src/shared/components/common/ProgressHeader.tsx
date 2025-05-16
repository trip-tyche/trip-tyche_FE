import { css } from '@emotion/react';

interface ProgressHeaderProps {
    currentStep: string;
}

const ProgressHeader = ({ currentStep }: ProgressHeaderProps) => {
    const isActive = (step: string) => {
        const steps = ['upload', 'processing', 'review', 'input'];
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
                <div css={[link, getConnectorStyle('input')]}></div>

                <div css={[step, getStepStyle('input')]}>4</div>
            </div>

            <div css={stepTable}>
                <span>사진 등록</span>
                <span>분석 중</span>
                <span>정보 확인</span>
                <span>정보 입력</span>
            </div>
        </div>
    );
};

const container = css`
    padding: 0.75rem 1rem;
    background-color: white;
    border-bottom: 1px solid #e5e7eb;
`;

const stepAndLink = css`
    display: flex;
    align-items: center;
`;

const step = css`
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
`;

const link = css`
    flex: 1;
    height: 0.25rem;
    margin-left: 0.25rem;
    margin-right: 0.25rem;
`;

const stepTable = css`
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 0.25rem;
    padding-left: 0.25rem;
    padding-right: 0.25rem;
`;

export default ProgressHeader;
