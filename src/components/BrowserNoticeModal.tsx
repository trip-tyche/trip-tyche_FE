import { css } from '@emotion/react';

import theme from '@/styles/theme';

interface BrowserNoticeModalProps {
    show: boolean;
    onClose: () => void;
    onChangeBrowser: () => void;
    message?: string;
}

const BrowserNoticeModal = ({
    show,
    onClose,
    onChangeBrowser,
    message = '원활한 로그인을 위해 Safari/Chrome 사용을 권장드립니다.',
}: BrowserNoticeModalProps) => {
    if (!show) return null;

    return (
        <div css={overlayStyle}>
            <div css={modalStyle}>
                <h2 css={modalTitleStyle}>브라우저 안내</h2>
                <p css={modalMessageStyle}>{message}</p>
                <div css={modalButtonGroupStyle}>
                    <button css={buttonStyle} onClick={onClose}>
                        계속 이용하기
                    </button>
                    <button css={[buttonStyle, primaryButtonStyle]} onClick={onChangeBrowser}>
                        브라우저 전환하기
                    </button>
                </div>
            </div>
        </div>
    );
};

const overlayStyle = css`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const modalStyle = css`
    background-color: white;
    padding: 24px;
    border-radius: 12px;
    width: 90%;
    max-width: 320px;
`;

const modalTitleStyle = css`
    font-size: ${theme.fontSizes.xlarge_18};
    font-weight: bold;
    margin-bottom: 16px;
    text-align: center;
`;

const modalMessageStyle = css`
    font-size: ${theme.fontSizes.normal_14};
    color: ${theme.colors.descriptionText};
    text-align: center;
    margin-bottom: 24px;
`;

const modalButtonGroupStyle = css`
    display: flex;
    gap: 12px;
`;

const buttonStyle = css`
    flex: 1;
    padding: 12px;
    border-radius: 8px;
    font-size: ${theme.fontSizes.normal_14};
    font-weight: bold;
    border: 1px solid ${theme.colors.borderColor};
    background-color: white;
    cursor: pointer;
`;

const primaryButtonStyle = css`
    background-color: ${theme.colors.primary};
    color: white;
    border: none;
`;

export default BrowserNoticeModal;
