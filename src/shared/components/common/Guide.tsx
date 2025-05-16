import { css } from '@emotion/react';

import { COLORS } from '@/shared/constants/style';

interface GuideProps {
    title: string;
    texts: string[];
}

const Guide = ({ title, texts }: GuideProps) => {
    return (
        <div css={container}>
            <p css={titleStyle}>{title}</p>

            {texts.map((text, index) => (
                <p key={index} css={textStylt}>
                    <span css={dot} />
                    {text}
                </p>
            ))}
        </div>
    );
};

const container = css`
    margin-bottom: 16px;
    padding: 12px;
    background-color: ${COLORS.BACKGROUND.WHITE};
    border-radius: 8px;
    border: 1px solid ${COLORS.BORDER};
    font-size: 14px;
    color: #4b5563;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    user-select: none;
`;

const titleStyle = css`
    margin-bottom: 8px;
    color: ${COLORS.PRIMARY_HOVER};
    font-weight: 500;
`;

const textStylt = css`
    margin-top: 4px;
    display: flex;
    align-items: center;
`;

const dot = css`
    width: 4px;
    height: 4px;
    margin-right: 8px;
    background-color: ${COLORS.PRIMARY};
    border-radius: 50%;
`;

export default Guide;
