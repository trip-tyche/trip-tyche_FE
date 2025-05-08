import { useState } from 'react';

import useUserStore from '@/domains/user/stores/useUserStore';
import { userAPI } from '@/libs/apis';
import { toResult } from '@/libs/apis/utils';
import { MESSAGE } from '@/shared/constants/ui';

export const useNickname = (nickname: string, onSuccess?: () => void) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const updateNickname = useUserStore((state) => state.updateNickname);

    const submitNickname = async () => {
        try {
            setIsSubmitting(true);
            const checkResult = await toResult(() => userAPI.checkNicknameDuplication(nickname));
            if (!checkResult.success) throw Error(checkResult.error);

            const createResult = await toResult(() => userAPI.createNickName(nickname));
            if (!createResult.success) throw Error(createResult.error);

            updateNickname(nickname);
            onSuccess?.();
        } catch (error) {
            setError(error instanceof Error ? error.message : MESSAGE.ERROR.UNKNOWN);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        isSubmitting,
        error,
        submitNickname,
    };
};
