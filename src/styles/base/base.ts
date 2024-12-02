import { css } from '@emotion/react';

import { scrollbarStyles } from '@/styles/base/scrollbar';
import theme from '@/styles/theme';

export const baseStyles = css`
    *,
    *::before,
    *::after {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        ${scrollbarStyles}
    }

    body {
        font-family: 'Pretendard', sans-serif;
        font-weight: 400;
        line-height: 1;
        font-size: ${theme.FONT_SIZES.LG};
        color: ${theme.COLORS.TEXT.BLACK};
        background-color: #eee;
        letter-spacing: -0.14px;
        overflow: hidden;
    }

    input,
    textarea {
        font-family: 'Pretendard', sans-serif;
        letter-spacing: -0.14px;
        color: ${theme.COLORS.TEXT.BLACK};

        &::placeholder {
            color: ${theme.COLORS.TEXT.DESCRIPTION_LIGHT};
            opacity: 1;
        }
    }

    .wrapper {
        background-color: ${theme.COLORS.BACKGROUND.WHITE};
        padding: 0 16px;
    }
`;
