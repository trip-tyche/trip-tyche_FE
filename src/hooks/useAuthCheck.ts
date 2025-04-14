import { useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';

import { userAPI } from '@/api';
import { toResult } from '@/api/utils';
import useUserStore from '@/stores/useUserStore';

export const useAuthCheck = () => {
    const [isChecking, setIsChecking] = useState(true);
    const { login, logout, isAuthenticated } = useUserStore();

    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            if (isAuthenticated) return;

            setIsChecking(true);
            const result = await toResult(() => userAPI.fetchUserInfo(), {
                onFinally: () => {
                    setIsChecking(false);
                },
            });
            if (!result.success) {
                logout();
                return;
            }

            const userInfo = result.data;
            login(userInfo);
        };

        checkAuth();
    }, [location.pathname, isAuthenticated, login, logout]);

    return { isChecking };
};
