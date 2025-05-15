import { css } from '@emotion/react';

import { COLORS } from '@/shared/constants/theme';

interface SpinnerProps {
    isLightBackGround?: boolean;
    diameter?: number;
}

const Spinner = ({ isLightBackGround = true, diameter = 30 }: SpinnerProps) => {
    return <div css={spinner(isLightBackGround, diameter)} />;
};

const spinner = (isLightBackGround: boolean, diameter: number) => css`
    border-radius: 15%;
    display: flex;

    &::after {
        content: '';
        width: ${`${diameter}px`};
        height: ${`${diameter}px`};
        border: 3px solid ${isLightBackGround ? COLORS.BORDER : COLORS.BACKGROUND.WHITE};
        border-radius: 50%;
        border-top-color: ${COLORS.SECONDARY};
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;

export default Spinner;
