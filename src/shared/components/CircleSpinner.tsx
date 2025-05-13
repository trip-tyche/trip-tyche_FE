import { css } from '@emotion/react';

import { COLORS } from '@/shared/constants/theme';

const CircleSpinner = () => {
    return <div css={spinner} />;
};

const spinner = css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 15%;
    display: flex;
    justify-content: center;
    align-items: center;

    &::after {
        content: '';
        width: 30px;
        height: 30px;
        border: 3px solid ${COLORS.BACKGROUND.WHITE};
        border-radius: 50%;
        border-top-color: ${COLORS.PRIMARY};
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;

export default CircleSpinner;
