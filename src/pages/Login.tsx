import { useNavigate } from 'react-router-dom';
import useIsLoginStore from '../store/loginStore';
import { LoginState } from '../types/loginStore';
import '../styles/Login.css';
import KakaoButton from '../components/common/Button/KakaoButton';
import FightHeader from '../components/layout/Header/AirplaneHeader';

export default function Login() {
    const setIsLogin = useIsLoginStore((state: LoginState) => state.setIsLogin);
    setIsLogin(false);

    const navigate = useNavigate();

    // const REST_API_KEY = '111111111';
    // const REDIRECT_URI = '/kakao/callback';
    // const link: string = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

    const handleLogin = () => {
        // window.location.href = link;
        navigate('/home');
    };

    return (
        <div className='container'>
            <FightHeader />
            {/* <Header title='로그인페이지' isBackButton={true} /> */}
            <p className='title'>Easily Manage and Relive Your Travel Memories</p>
            <p className='title-sec'>Discover the world and share your adventures</p>
            <p className='title-sec'>with our travel journal app.</p>
            <div className='img-container'>
                <img src='../../public/character.png' alt='character' className='character' />
                <img src='../../public/earth.png' alt='earth' className='earth' />
            </div>
            <div className='button-container'>
                <KakaoButton handleLogin={handleLogin} />
            </div>
        </div>
    );
}
