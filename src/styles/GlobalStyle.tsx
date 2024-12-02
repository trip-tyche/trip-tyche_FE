import { css, Global } from '@emotion/react';

import { baseStyles } from '@/styles/base/base';
import fontStyles from '@/styles/base/fonts';
import { resetStyles } from '@/styles/base/reset';

const globalStyles = css`
    ${fontStyles}
    ${resetStyles}
    ${baseStyles}
`;

const GlobalStyle = () => <Global styles={globalStyles} />;

export default GlobalStyle;
