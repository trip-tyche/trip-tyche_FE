import { css } from '@emotion/react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import theme from '@/styles/theme';

interface HeaderProps {
    title: string;
    isBackButton?: boolean;
    onBack?: () => void;
}
const Header = ({ title, isBackButton, onBack }: HeaderProps): JSX.Element => {
    const navigate = useNavigate();

    const handleBack = () => {
        onBack ? onBack() : navigate(-1);
    };

    return (
        <div css={headerStyle}>
            {isBackButton && (
                <div css={backButtonStyle} onClick={handleBack}>
                    <ChevronLeft size={24} strokeWidth={1.5} />
                </div>
            )}
            <h1>{title}</h1>
        </div>
    );
};

const headerStyle = css`
    height: ${theme.heights.tall_54};
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid ${theme.colors.borderColor};
    position: relative;
    background-color: ${theme.colors.white};
    z-index: 800;
    overflow: hidden;

    h1 {
        font-size: ${theme.fontSizes.large_16};
        font-weight: 600;
    }
`;

const backButtonStyle = css`
    position: absolute;
    left: 10px;
    cursor: pointer;
`;

export default Header;
