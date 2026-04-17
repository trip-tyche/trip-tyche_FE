import { css } from '@emotion/react';

import digitalBoldItalic from '@/assets/fonts/DS-Digital-BoldItalic.woff';

const fontStyles = css`
    @font-face {
        font-family: 'DS-DIGII';
        src: url(${digitalBoldItalic}) format('woff');
        font-weight: bold;
        font-style: italic;
    }
`;

export default fontStyles;
