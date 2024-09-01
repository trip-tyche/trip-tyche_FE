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
    height: 100%;
    background-color: rgb(0, 0, 0, 0.5);
    z-index: 9;
`;
