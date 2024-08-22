import { css, Global } from '@emotion/react';

// import fontStyles from './globalFonts';
// import theme from './theme';

const baseStyles = css`
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
        font-size: 10px;
    }
    body {
        margin: 0;
        padding: 0;
        background-color: #eee;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #root {
        font-weight: 400;
        font-size: 10px;
        /* letter-spacing: -0.14px; */

        background-color: #fff;
        width: 100%;
        max-width: 430px;
        height: 100vh;

        margin: 0 auto;
        position: relative;
    }
`;

const GlobalStyle = () => <Global styles={baseStyles} />;

export default GlobalStyle;
