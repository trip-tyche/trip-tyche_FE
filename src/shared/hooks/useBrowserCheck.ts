import { useState, useEffect } from 'react';

interface BrowserCheckOptions {
    showOnce?: boolean;
}

const useBrowserCheck = ({ showOnce = true }: BrowserCheckOptions) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const userAgent = navigator.userAgent.toLowerCase();
        const isKakaoBrowser = userAgent.includes('kakaotalk');

        const hasShownNotice = localStorage.getItem('browser-notice-shown');

        if (isKakaoBrowser && (!showOnce || !hasShownNotice)) {
            setIsModalOpen(true);
        }
    }, [showOnce]);

    const closeModal = () => {
        setIsModalOpen(false);
        if (showOnce) {
            localStorage.setItem('browser-notice-shown', 'true');
        }
    };

    return {
        isModalOpen,
        closeModal,
    };
};

export default useBrowserCheck;
