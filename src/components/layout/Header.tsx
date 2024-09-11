import { css } from '@emotion/react';
import { ChevronLeft } from 'lucide-react';

import theme from '@/styles/theme';

interface HeaderProps {
    title: string;
    isBackButton?: boolean;
    onClick?: () => void;
}

const Header = ({ title, isBackButton, onClick }: HeaderProps): JSX.Element => (
    <>
        <div css={HeaderStyle}>
            {isBackButton && (
                <div css={backButtonContainerStyle} onClick={onClick}>
                    <ChevronLeft size={28} />
                </div>
            )}
            <h1>{title}</h1>
        </div>
    </>
);

export default Header;

const backButtonContainerStyle = css`
    position: absolute;
    left: 10px;
    cursor: pointer;
`;

const HeaderStyle = css`
    height: ${theme.heights.tall_54};
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #dddddd;
    position: relative;
    background-color: ${theme.colors.white};

    h1 {
        font-size: ${theme.fontSizes.xlarge_18};
        font-weight: 600;
    }
`;
