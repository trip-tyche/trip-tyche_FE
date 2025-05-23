import { useEffect } from 'react';

import { useSummary } from '@/domains/user/hooks/queries';
import useUserStore from '@/domains/user/stores/useUserStore';

export const useAuthCheck = () => {
    const { login, logout, isAuthenticated, isLoggingOut } = useUserStore();

    const { data: result, isLoading: isChecking } = useSummary();
    console.log('useAuthCheck render');

    useEffect(() => {
        const checkAuth = async () => {
            if (isAuthenticated || isLoggingOut) {
                return;
            }

            if (result) {
                if (!result.success) {
                    logout();
                    return;
                }

                const userInfo = result.data;
                login(userInfo);
            }
        };

        checkAuth();
    }, [result, isAuthenticated, isLoggingOut, login, logout]);

    return { isChecking };
};
