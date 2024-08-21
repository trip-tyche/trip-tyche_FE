import { NavLink } from 'react-router-dom';
import { css } from '@emotion/react';

export default function Navbar() {
    return (
        <nav className='nav' css={NavbarStyle}>
            <NavLink to={'/home'}>홈</NavLink>
            <NavLink to={'/trip-list'}>여행관리</NavLink>
            <NavLink to={'/my-page'}>마이페이지</NavLink>
        </nav>
    );
}

const NavbarStyle = css`
    position: fixed;
    bottom: 0;
    padding: 4px;
    margin-bottom: 10px;
    display: flex;

    a {
        font-size: 18px;
        flex: 1;
        border: 1px solid #ccc;
        padding: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-decoration: none;
        color: #333;
        background-color: #fff;
    }

    a:hover {
        background-color: #333;
        color: #fff;
    }

    a:first-child {
        border-radius: 10px 0 0 10px;
    }

    a:last-child {
        border-radius: 0 10px 10px 0;
    }
`;
