import { useState } from 'react';

import { shareAPI, userAPI } from '@/api';
import { toResult } from '@/api/utils';
import { MESSAGE } from '@/constants/ui';

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

            const shareResult = await toResult(() => shareAPI.createShareRequest(tripKey, recipientId));
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
