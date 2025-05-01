import { useState } from 'react';

import { MESSAGE } from '@/shared/constants/ui';
import { shareAPI, userAPI } from '@/libs/apis';
import { toResult } from '@/libs/apis/utils';

export const useTripShare = (nickname: string, tripKey: string, onSuccess?: () => void) => {
    const [isSharing, setIsSharing] = useState(false);
    const [error, setError] = useState('');

    const shareTrip = async () => {
        try {
            setIsSharing(true);
            const searchResult = await toResult(() => userAPI.searchUsers(nickname));
            if (!searchResult.success) throw Error(searchResult.error);

            const {
                data: { userId: recipientId },
            } = searchResult;

            const shareResult = await toResult(() => shareAPI.requestTripShare(tripKey, recipientId));
            if (!shareResult.success) throw Error(shareResult.error);

            onSuccess?.();
        } catch (error) {
            setError(error instanceof Error ? error.message : MESSAGE.ERROR.UNKNOWN);
        } finally {
            setIsSharing(false);
        }
    };

    const clearError = () => {
        setError('');
    };

    return {
        isSharing,
        error,
        setError,
        shareTrip,
        clearError,
    };
};
