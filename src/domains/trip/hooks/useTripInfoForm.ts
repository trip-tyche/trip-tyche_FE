import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { ROUTES } from '@/constants/paths';
import { MESSAGE } from '@/constants/ui';
import { useTripUpdate } from '@/domains/trip/hooks/mutations';
import { TripInfo } from '@/domains/trip/types';
import { tripAPI } from '@/libs/apis';
import { toResult } from '@/libs/apis/utils';
import { validateFormComplete } from '@/libs/utils/validate';
import { useToastStore } from '@/stores/useToastStore';
import { useUploadStore } from '@/stores/useUploadingStore';

export const useTripInfoForm = (isEditing: boolean, form: TripInfo) => {
    const [isImageSubmitting, setIsImageSubmitting] = useState(false);
    const [isFormComplete, setIsFormComplete] = useState(false);
    const { uploadStatus, waitForCompletion } = useUploadStore();
    const showToast = useToastStore((state) => state.showToast);

    const navigate = useNavigate();
    const { tripKey } = useParams();

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
                queryClient.invalidateQueries({ queryKey: ['ticket-info'] });
                showToast('여행 정보가 성공적으로 수정되었습니다');
            } else {
                const finalizeResult = await toResult(() => tripAPI.finalizeTripTicekt(tripKey));
                if (!finalizeResult.success) throw Error(finalizeResult.error);

                setIsImageSubmitting(true);
                await waitForCompletion();
                if (uploadStatus === 'error') throw Error('사진 등록이 실패했습니다. 다시 추가해 주세요');
                setIsImageSubmitting(false);

                showToast('새로운 여행이 등록되었습니다');
            }

            queryClient.invalidateQueries({ queryKey: ['ticket-list'] });
            navigate(ROUTES.PATH.TRIP.ROOT);
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
