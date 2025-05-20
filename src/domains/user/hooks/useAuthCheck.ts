import { useEffect } from 'react';

import { useSummary } from '@/domains/user/hooks/queries';
import useUserStore from '@/domains/user/stores/useUserStore';

export const useAuthCheck = () => {
    const { login, logout, isAuthenticated } = useUserStore();

    const { data: result, isLoading: isChecking } = useSummary();
    console.log('useAuthCheck render');

    useEffect(() => {
        const checkAuth = async () => {
            if (isAuthenticated) {
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
    }, [result, isAuthenticated, login, logout]);

    return { isChecking };
};
