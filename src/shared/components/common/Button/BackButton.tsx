import { css } from '@emotion/react';
import { ChevronLeft } from 'lucide-react';

import { COLORS } from '@/shared/constants/theme';

const BackButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <button css={buttonStyle} onClick={onClick}>
            <ChevronLeft color={COLORS.TEXT.DESCRIPTION} size={24} strokeWidth={1.5} />
        </button>
    );
};

const buttonStyle = css`
    width: 40px;
    height: 40px;
    position: absolute;
    z-index: 1;
    top: 8px;
    left: 8px;
    border: 1px solid ${COLORS.TEXT.DESCRIPTION};
    border: none;
    box-shadow:
        rgba(50, 50, 93, 0.25) 13px 13px 30px -10px,
        rgba(0, 0, 0, 0.8) 5px 8px 16px -10px;
    border-radius: 4px;
    cursor: pointer;
`;

export default BackButton;
