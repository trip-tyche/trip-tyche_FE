import { useState } from 'react';

import { shareAPI, userAPI } from '@/api';
import { toResult } from '@/api/utils';

export const useTripShare = (
    nickname: string,
    tripKey: string,
    callback?: {
        onSuccess?: () => void;
        onError?: (errorMessage: string) => void;
    },
) => {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { onSuccess, onError } = callback || {};

    const shareTrip = async () => {
        setIsLoading(true);

        try {
            const searchResult = await toResult(() => userAPI.searchUsers(nickname));
            if (!searchResult.success) throw Error(searchResult.error);

            const {
                data: { userId: recipientId },
            } = searchResult;

            const shareResult = await toResult(() => shareAPI.createShareRequest(tripKey, recipientId));
            if (!shareResult.success) throw Error(shareResult.error);

            onSuccess?.();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
            setError(errorMessage);
            onError?.(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = () => {
        setError('');
    };

    return {
        isLoading,
        error,
        setError,
        shareTrip,
        clearError,
    };
};
