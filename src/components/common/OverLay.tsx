import { css } from '@emotion/react';

const OverLay = () => {
    return <div css={overlay}></div>;
};

export default OverLay;

const overlay = css`
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgb(0, 0, 0, 0.5);
`;
