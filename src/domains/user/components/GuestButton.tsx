import { css } from '@emotion/react';

interface GuestButtonProps {
    onClick: () => void;
}

const GuestButton = ({ onClick }: GuestButtonProps) => {
    return (
        <button type="button" css={guestButtonStyles} onClick={onClick}>
            <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M7 17l10-10M7 7h10v10" />
            </svg>
            게스트로 둘러보기
        </button>
    );
};

const guestButtonStyles = css`
    height: 48px;
    width: 100%;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    background: transparent;
    color: rgba(255, 255, 255, 0.78);
    font-family: -apple-system, 'SF Pro Text', 'Apple SD Gothic Neo', 'Pretendard', sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.2px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: background 0.2s ease, border-color 0.2s ease;

    @media (hover: hover) {
        &:hover {
            background: rgba(255, 255, 255, 0.04);
            border-color: rgba(255, 255, 255, 0.28);
        }
    }
    &:active {
        opacity: 0.85;
    }
`;

export default GuestButton;
