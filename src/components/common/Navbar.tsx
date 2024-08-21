import { NavLink } from 'react-router-dom';
import '/src/styles/Navbar.css';

export default function Navbar() {
  return (
    <nav className="nav">
      <NavLink to={'/home'}>홈</NavLink>
      <NavLink to={'/trip-list'}>여행관리</NavLink>
      <NavLink to={'/my-page'}>마이페이지</NavLink>
    </nav>
  );
}
