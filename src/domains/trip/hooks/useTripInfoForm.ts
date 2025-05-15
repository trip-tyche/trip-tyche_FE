import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useTripUpdate } from '@/domains/trip/hooks/mutations';
import { TripInfo } from '@/domains/trip/types';
import { tripAPI } from '@/libs/apis';
import { toResult } from '@/libs/apis/shared/utils';
import { validateFormComplete } from '@/libs/utils/validate';
import { ROUTES } from '@/shared/constants/route';
import { MESSAGE } from '@/shared/constants/ui';
import { useToastStore } from '@/shared/stores/useToastStore';
import { useUploadStatusStore } from '@/shared/stores/useUploadStatusStore';

export const useTripInfoForm = (isEditing: boolean, form: TripInfo) => {
    const [isImageSubmitting, setIsImageSubmitting] = useState(false);
    const [isFormComplete, setIsFormComplete] = useState(false);
    const { uploadStatus, waitForCompletion } = useUploadStatusStore();
    const showToast = useToastStore((state) => state.showToast);

    const navigate = useNavigate();
    const { tripKey } = useParams();
    const [searchParams] = useSearchParams();

    const isUnCompletedTrip = searchParams.get('isUnCompleted') !== null;

    const queryClient = useQueryClient();

    const { mutateAsync, isPending: isSubmitting } = useTripUpdate();

    useEffect(() => {
        if (validateFormComplete(form)) {
            setIsFormComplete(true);
            return;
        }
        setIsFormComplete(false);
    }, [form]);

    const submitTripInfo = async () => {
        if (!tripKey || !form) return;

        try {
            const updateResult = await mutateAsync({ tripKey, form });
            if (!updateResult.success) throw Error(updateResult.error);

            if (isEditing) {
                if (isUnCompletedTrip) {
                    const finalizeResult = await toResult(() => tripAPI.finalizeTripTicket(tripKey));
                    if (!finalizeResult.success) throw Error(finalizeResult.error);
                }
                queryClient.invalidateQueries({ queryKey: ['ticket-info'] });
                showToast('여행 정보가 성공적으로 수정되었습니다');
            } else {
                const finalizeResult = await toResult(() => tripAPI.finalizeTripTicket(tripKey));
                if (!finalizeResult.success) throw Error(finalizeResult.error);

                setIsImageSubmitting(true);
                await waitForCompletion();
                if (uploadStatus === 'error') throw Error('사진 등록이 실패했습니다. 다시 추가해 주세요');
                setIsImageSubmitting(false);

                showToast('새로운 여행이 등록되었습니다');
            }

            queryClient.invalidateQueries({ queryKey: ['ticket-list'] });
            navigate(ROUTES.PATH.MAIN);
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? isEditing
                        ? '여행 정보 수정에 실패했습니다. 다시 시도해 주세요.'
                        : error.message
                    : MESSAGE.ERROR.UNKNOWN;
            showToast(errorMessage);
        }
    };

    return { isImageSubmitting, isSubmitting, isFormComplete, submitTripInfo };
};
