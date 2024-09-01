import { css, Global } from '@emotion/react';

import fontStyles from '@/styles/globalFonts';
import theme from '@/styles/theme';

const baseStyles = css`
    ${fontStyles} /* @font-face */

    /* reset */
    html,
    body,
    div,
    span,
    applet,
    object,
    iframe,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p,
    blockquote,
    pre,
    a,
    address,
    code,
    img,
    small,
    strike,
    strong,
    b,
    u,
    i,
    center,
    dl,
    dt,
    dd,
    ol,
    ul,
    li,
    fieldset,
    form,
    label,
    legend,
    table,
    caption,
    tbody,
    tfoot,
    thead,
    tr,
    th,
    td,
    article,
    aside,
    details,
    figure,
    figcaption,
    footer,
    header,
    hgroup,
    menu,
    nav,
    section,
    summary,
    time {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        font: inherit;
        vertical-align: baseline;
    }

    /* base */
    *,
    *::before,
    *::after {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        /* outline: 1px solid red; */
    }
    html {
        /* 스크롤바 각 브라우저마다 보이지 않게 동작 */
        // Webkit browsers (Chrome, Safari)
        &::-webkit-scrollbar {
            display: none;
        }
        scrollbar-width: none; // Firefox
        -ms-overflow-style: none; // IE and Edge

        // (추가) 터치 기기에서의 스크롤 동작 개선, 네이티브와 같이 동작
        -webkit-overflow-scrolling: touch;
    }
    body {
        font-family: 'Pretendard', sans-serif;
        font-weight: 400;
        line-height: 1;
        font-size: ${theme.fontSizes.large}; /* 16px */
        color: ${theme.colors.black};
        background-color: ${theme.colors.black};
        letter-spacing: -0.14px;
    }

    input,
    textarea {
        font-family: 'Pretendard', sans-serif;
        letter-spacing: -0.14px;
        color: ${theme.colors.black};

        &::placeholder {
            color: ${theme.colors.darkGray};
            opacity: 1; /* Firefox */
        }
    }

    /* 공통 페이지 여백 */
    .wrapper {
        background-color: ${theme.colors.white};
        padding: 0 16px; /* 1rem */
    }
    /* 공통 페이지 타이틀 */
    .page-title {
        padding: 32px 0 20px 16px;
        font-weight: bold;
        font-size: ${theme.fontSizes.xxlarge};
        background-color: ${theme.colors.white};
    }
`;

const GlobalStyle = () => <Global styles={baseStyles} />;

export default GlobalStyle;
