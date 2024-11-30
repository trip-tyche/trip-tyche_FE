import { useState, useEffect } from 'react';

interface BrowserCheckOptions {
    showOnce?: boolean;
}

const useBrowserCheck = ({ showOnce }: BrowserCheckOptions) => {
    const [isKakao, setIsKakao] = useState(false);
    const [showNotice, setShowNotice] = useState(false);

    useEffect(() => {
        // 카카오톡 브라우저 체크
        const userAgent = navigator.userAgent.toLowerCase();
        const isKakaoBrowser = userAgent.includes('kakaotalk');
        // const isKakaoBrowser = userAgent.includes('safari');
        setIsKakao(isKakaoBrowser);

        // console.log(userAgent, isKakaoBrowser);

        // localStorage에서 이전 알림 여부 확인
        // const hasShownNotice = localStorage.getItem('browser-notice-shown');

        // showOnce 옵션이 true이고 이전에 알림을 보여준 적이 없으면 알림 표시
        // if (isKakaoBrowser && (!showOnce || !hasShownNotice)) {
        if (isKakaoBrowser && !showOnce) {
            setShowNotice(true);
        }
    }, [showOnce]);

    const handleBrowserChange = () => {
        const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
        const currentUrl = window.location.href;

        if (showOnce) {
            localStorage.setItem('browser-notice-shown', 'true');
        }

        if (isIOS) {
            window.location.href = currentUrl;
        } else {
            window.location.href = `intent://${window.location.href.replace(/https?:\/\//i, '')}#Intent;scheme=https;package=com.android.chrome;end`;
        }
    };

    const closeNotice = () => {
        setShowNotice(false);
        if (showOnce) {
            localStorage.setItem('browser-notice-shown', 'true');
        }
    };

    return {
        isKakao,
        showNotice,
        handleBrowserChange,
        closeNotice,
    };
};

export default useBrowserCheck;
