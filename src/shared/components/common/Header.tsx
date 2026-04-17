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
    padding: 0 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 48px;
    background-color: rgba(0, 0, 0, 0.8);
    backdrop-filter: saturate(180%) blur(20px);
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    z-index: 30;
    user-select: none;
    position: sticky;
    top: 0;
`;

const defaultStyle = css`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const titleStyle = css`
    font-size: 17px;
    font-weight: 600;
    letter-spacing: -0.374px;
    color: #ffffff;
`;

const backButtonStyle = css`
    cursor: pointer;
    color: #ffffff;
    opacity: 0.9;
    transition: opacity 0.15s;
    &:active {
        opacity: 0.6;
    }
`;

export default Header;
