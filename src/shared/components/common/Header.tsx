import { css } from '@emotion/react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import theme from '@/shared/styles/theme';

interface HeaderProps {
    title: string;
    isBackButton?: boolean;
    children?: React.ReactNode;
    onBack?: () => void;
}
const Header = ({ title, isBackButton, children, onBack }: HeaderProps) => {
    const navigate = useNavigate();

    const navigateBeforePage = () => (onBack ? onBack() : navigate(-1));

    return (
        <div css={headerStyle}>
            <div css={defaultStyle}>
                {isBackButton && (
                    <ChevronLeft size={20} strokeWidth={1.5} css={backButtonStyle} onClick={navigateBeforePage} />
                )}
                <h1 css={titleStyle}>{title}</h1>
            </div>
            {children}
        </div>
    );
};

const headerStyle = css`
    padding: 8px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 54px;
    border-bottom: 1px solid ${theme.COLORS.BORDER};
    background-color: ${theme.COLORS.BACKGROUND.WHITE};
    z-index: 30;
    user-select: none;
`;

const defaultStyle = css`
    display: flex;
    align-items: center;
    gap: 14px;
`;

const titleStyle = css`
    font-weight: 600;
`;

const backButtonStyle = css`
    cursor: pointer;
`;

export default Header;
