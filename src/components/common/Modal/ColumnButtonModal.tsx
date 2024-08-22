import { css } from '@emotion/react';

import ButtonContainer from '@/components/common/Button/ButtonContainer';

const ColumnButtonModal = ({ confirmModal, closeLogoutModal }) => {
    return (
        <div css={modalStyle}>
            <h2>로그아웃</h2>
            <p>정말 로그아웃할까요?</p>
            <div>
                <ButtonContainer
                    confirmText='로그아웃'
                    cancelText='닫기'
                    size='lg'
                    confirmModal={confirmModal}
                    closeLogoutModal={closeLogoutModal}
                />
            </div>
        </div>
    );
};

export default ColumnButtonModal;

const modalStyle = css`
    h2 {
        font-size: 24px;
        font-weight: 600;
    }
    p {
        font-size: 18px;
    }

    div {
        margin: 0.5rem 0;
        display: flex;
        justify-content: center;
    }

    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    background-color: #fff;
    width: 300px;
    height: 210px;
    padding: 1.8rem;
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-radius: 20px;
    z-index: 1;
    border: 1px solid #ccc;
`;
