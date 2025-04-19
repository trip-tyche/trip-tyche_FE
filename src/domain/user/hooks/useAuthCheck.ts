import { useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';

import useUserStore from '@/domain/user/stores/useUserStore';
import { userAPI } from '@/libs/apis';
import { toResult } from '@/libs/apis/utils';

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
