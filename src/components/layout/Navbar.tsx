import { css } from '@emotion/react';
import { UserRound, TicketsPlane, Earth } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { PATH, PATH_TITLE } from '@/constants/path';
import theme from '@/styles/theme';

const Navbar = () => {
    const menus = [
        { path: PATH.HOME, title: PATH_TITLE.HOME, Icon: Earth },
        { path: PATH.TRIP_LIST, title: PATH_TITLE.TRIP_LIST, Icon: TicketsPlane },
        { path: PATH.MYPAGE, title: PATH_TITLE.MYPAGE, Icon: UserRound },
    ];

    return (
        <nav css={navStyle}>
            <ul css={ulStyle}>
                {menus.map(({ path, title, Icon }) => (
                    <li key={path} css={liStyle}>
                        <NavLink to={path} css={linkStyle}>
                            {({ isActive }) => (
                                <>
                                    {isActive ? (
                                        <Icon strokeWidth={3} css={activeIconStyle} />
                                    ) : (
                                        <Icon css={iconStyle} />
                                    )}
                                    <span>{title}</span>
                                </>
                            )}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

const navStyle = css`
    z-index: 10;
    position: fixed;
    bottom: 0;
    max-width: 428px;
    width: 100vw;
    height: 70px;
    border-top: 1px solid ${theme.colors.disabled};
    background-color: ${theme.colors.white};
    border-radius: 10px 10px 0 0;
`;
const ulStyle = css`
    display: flex;
`;
const liStyle = css`
    flex-grow: 1;
    flex-basis: 0;
    list-style: none;
    &:hover {
        cursor: pointer;
    }
`;
const linkStyle = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 55px;
    gap: 8px;
    padding-top: 14px;
    text-decoration: none;
    color: ${theme.colors.disabledText};
    font-weight: 400;

    &.active {
        color: ${theme.colors.tertiary};
        font-weight: 600;
    }

    span {
        width: 100%;
        text-align: center;
        font-size: ${theme.fontSizes.small_12};
    }
`;
const iconStyle = css`
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const activeIconStyle = css`
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export default Navbar;
