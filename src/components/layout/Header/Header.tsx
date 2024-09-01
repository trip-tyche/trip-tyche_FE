import { css } from '@emotion/react';

import BackButtonSvg from '../../../assets/icons/BackButtonSvg';

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
                    <BackButtonSvg />
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
    height: 54px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #ddd;
    position: relative;

    h1 {
        font-size: 18px;
        font-weight: 600;
    }
`;
