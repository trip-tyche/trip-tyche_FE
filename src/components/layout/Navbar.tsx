import { css } from '@emotion/react';
import { Camera } from 'lucide-react';
import { NavLink } from 'react-router-dom';

// import { PATH, PATH_TITLE } from '@/constants/path';
import theme from '@/styles/theme';

const Navbar = () => (
    //       const menus = [
    //     { path: PATH.HOME, title: PATH_TITLE.HOME, Icon: RiHome5Line, ActiveIcon: RiHome5Fill },
    //     { path: PATH.SEARCH, title: PATH_TITLE.SEARCH, Icon: RiSearchLine, ActiveIcon: RiSearch2Fill },
    //     {
    //       path: PATH.SUBSCRIPTIONS,
    //       title: PATH_TITLE.SUBSCRIPTIONS,
    //       Icon: RiStackLine,
    //       ActiveIcon: RiStackFill,
    //     },
    //     { path: PATH.MYPAGE, title: PATH_TITLE.MYPAGE, Icon: RiUserLine, ActiveIcon: RiUserFill },
    //   ];

    <nav className='nav' css={navbarStyle}>
        <NavLink to={'/home'}>
            <Camera size={24} />홈
        </NavLink>
        <NavLink to={'/trips'}>
            <Camera size={24} />
            여행관리
        </NavLink>
        <NavLink to={'/my-page'}>
            <Camera size={24} />
            마이페이지
        </NavLink>
    </nav>
);

export default Navbar;

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
