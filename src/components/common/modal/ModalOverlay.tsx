import { css } from '@emotion/react';

export interface ModalOverlayProps {
    closeModal?: () => void;
}

const ModalOverlay = ({ closeModal }: ModalOverlayProps): JSX.Element => (
    <div css={modalOverlayStyle} onClick={closeModal}></div>
);

const modalOverlayStyle = css`
    cursor: pointer;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: fixed;
    width: 100%;
    min-height: 100vh;
    background-color: rgb(0, 0, 0, 0.7);
    z-index: 999;
`;

export default ModalOverlay;
