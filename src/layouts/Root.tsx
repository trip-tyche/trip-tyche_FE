import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import useIsLoginStore from '../store/loginStore';
import { LoginState } from '../types/loginStore';

export default function Root() {
  const isLogin = useIsLoginStore((state: LoginState) => state.isLogin);
  // const setIsLogin = useIsLoginStore((state: BearState) => state.setIsLogin);

  return (
    <>
      <Outlet />
      {isLogin && <Navbar />}
    </>
  );
}
