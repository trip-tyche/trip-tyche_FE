import { css } from '@emotion/react';

export interface ModalOverlayProps {
    closeModal?: () => void;
}

const ModalOverlay = ({ closeModal }: ModalOverlayProps): JSX.Element => (
    <div css={modalOverlayStyle} onClick={closeModal}></div>
);

const modalOverlayStyle = css`
    cursor: pointer;
    position: absolute;
    width: 100%;
    min-height: 100vh;
    background-color: rgb(0, 0, 0, 0.5);
    z-index: 9;
`;

export default ModalOverlay;
