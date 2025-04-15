import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { tripAPI } from '@/api';
import { ROUTES } from '@/constants/paths';
import { TripInfo } from '@/domain/trip/types';
import { useToastStore } from '@/stores/useToastStore';
import { useUploadStore } from '@/stores/useUploadingStore';
import { validateFormComplete } from '@/utils/validate';

export const useTripInfoForm = (isEditing: boolean, form: TripInfo) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFormComplete, setIsFormComplete] = useState(false);
    const { uploadStatus, waitForCompletion } = useUploadStore();
    const showToast = useToastStore((state) => state.showToast);

    const navigate = useNavigate();
    const { tripKey } = useParams();

    const queryClient = useQueryClient();

    // 여행 정보 입력할 때마다 모든 값이 입력되었는지 체크
    useEffect(() => {
        if (validateFormComplete(form)) {
            setIsFormComplete(true);
            return;
        }
        setIsFormComplete(false);
    }, [form]);

    const submitTripInfo = async () => {
        if (!tripKey || !form) {
            return;
        }

        if (!isEditing) {
            await tripAPI.updateTripTicketInfo(tripKey, form);
            await tripAPI.finalizeTripTicekt(tripKey);

            setIsSubmitting(true);
            await waitForCompletion();
            setIsSubmitting(false);

            queryClient.invalidateQueries({ queryKey: ['ticket-list'] });
            navigate(ROUTES.PATH.TRIPS.ROOT);
            showToast(
                uploadStatus === 'error'
                    ? '사진 등록이 실패했습니다. 다시 추가해 주세요.'
                    : '새로운 여행이 등록되었습니다.',
            );
        } else {
            try {
                await tripAPI.updateTripTicketInfo(tripKey, form);
                queryClient.invalidateQueries({ queryKey: ['ticket-list'] });
                queryClient.invalidateQueries({ queryKey: ['ticket-info'] });

                showToast('여행 정보가 성공적으로 수정되었습니다.');
            } catch (error) {
                showToast('여행 정보 수정에 실패했습니다. 다시 시도해 주세요.');
            } finally {
                navigate(ROUTES.PATH.TRIPS.ROOT);
                // setIsTripInfoEditing(false);
            }
        }
    };

    return { isSubmitting, isFormComplete, submitTripInfo };
};
