import { NavLink } from 'react-router-dom';
import { css } from '@emotion/react';

export default function Navbar() {
    return (
        <nav className='nav' css={navbarStyle}>
            <NavLink to={'/home'}>홈</NavLink>
            <NavLink to={'/trip-list'}>여행관리</NavLink>
            <NavLink to={'/my-page'}>마이페이지</NavLink>
        </nav>
    );
}

const navbarStyle = css`
    position: fixed;
    bottom: 0;
    width: 100%;
    max-width: 430px;
    height: 6rem;

    display: flex;
    background-color: #fff;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);

    a {
        flex: 1;
        padding: 2rem;
        font-size: 14px;
        text-align: center;
        text-decoration: none;
        color: #333;
        transition: background-color 0.3s;

        &:hover,
        &.active {
            background-color: #f0f0f0;
            color: #000;
        }
    }
`;
