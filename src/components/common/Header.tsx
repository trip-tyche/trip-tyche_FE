import { css } from '@emotion/react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import theme from '@/styles/theme';

interface HeaderProps {
    title: string;
    isBackButton?: boolean;
    onBack?: () => void;
}
const Header = ({ title, isBackButton, onBack }: HeaderProps) => {
    const navigate = useNavigate();

    const navigateBeforePage = () => (onBack ? onBack() : navigate(-1));

    return (
        <div css={headerStyle}>
            {isBackButton && (
                <ChevronLeft size={24} strokeWidth={1.5} css={backButtonStyle} onClick={navigateBeforePage} />
            )}
            <h1 css={titleStyle}>{title}</h1>
        </div>
    );
};

const headerStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 48px;
    position: relative;
    border-bottom: 1px solid ${theme.COLORS.BORDER};
    background-color: ${theme.COLORS.TEXT.WHITE};
    z-index: 998;
`;

const titleStyle = css`
    font-size: ${theme.FONT_SIZES.LG};
    font-weight: 600;
`;

const backButtonStyle = css`
    position: absolute;
    left: 12px;
    cursor: pointer;
`;

export default Header;
