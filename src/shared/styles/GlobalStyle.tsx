import { css, Global } from '@emotion/react';

import { baseStyles } from '@/shared/styles/base/base';
import fontStyles from '@/shared/styles/base/fonts';
import { resetStyles } from '@/shared/styles/base/reset';

const globalStyles = css`
    ${fontStyles}
    ${resetStyles}
    ${baseStyles}
`;

const GlobalStyle = () => <Global styles={globalStyles} />;

export default GlobalStyle;
