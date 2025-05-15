import { useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';

import useUserStore from '@/domains/user/stores/useUserStore';
import { userAPI } from '@/libs/apis';
import { toResult } from '@/libs/apis/shared/utils';

export const useAuthCheck = () => {
    const [isChecking, setIsChecking] = useState(true);
    const { login, logout, isAuthenticated } = useUserStore();

    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            if (isAuthenticated) {
                setIsChecking(false);
                return;
            }

            setIsChecking(true);
            const result = await toResult(() => userAPI.fetchUserInfo(), {
                onSuccess: () => {
                    setIsChecking(false);
                },
            });
            if (!result.success) {
                logout();
                return;
            }

            const userInfo = result.data;
            login(userInfo);
            setIsChecking(false);
        };

        checkAuth();
    }, [location.pathname, isAuthenticated, login, logout]);

    return { isChecking };
};
