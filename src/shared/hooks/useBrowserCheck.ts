import { useState, useEffect } from 'react';

const useBrowserCheck = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const userAgent = navigator.userAgent.toLowerCase();
        const isAndroidBrowser = userAgent.includes('android');

        if (isAndroidBrowser) {
            setIsModalOpen(true);
        }
    }, []);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return {
        isModalOpen,
        closeModal,
    };
};

export default useBrowserCheck;
