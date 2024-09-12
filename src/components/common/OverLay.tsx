import { css } from '@emotion/react';

export interface OverLayProps {
    closeModal?: () => void;
}

const OverLay = ({ closeModal }: OverLayProps): JSX.Element => <div css={overlay} onClick={closeModal}></div>;

export default OverLay;

const overlay = css`
    cursor: pointer;
    position: absolute;
    width: 100%;
    /* min-height: 100vh; */
    min-height: 100vh;
    background-color: rgb(0, 0, 0, 0.5);
    z-index: 9;
`;
