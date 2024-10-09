import { useState, useEffect } from 'react';

const useViewportHeight = () => {
    const [vh, setVh] = useState(window.innerHeight * 0.01);

    useEffect(() => {
        const handleResize = () => {
            setVh(window.innerHeight * 0.01);
        };

        window.addEventListener('resize', handleResize);

        // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }, [vh]);

    return vh;
};

export default useViewportHeight;
