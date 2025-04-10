import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { tripAPI } from '@/api';
import { ROUTES } from '@/constants/paths';
import { useTripTicketInfo } from '@/hooks/queries/useTrip';
import { useToastStore } from '@/stores/useToastStore';
import { useUploadStore } from '@/stores/useUploadingStore';
import useUserDataStore from '@/stores/useUserDataStore';
import { FormMode } from '@/types/common';
import { Trip } from '@/types/trip';

export const useTripInfoForm = (mode: FormMode) => {
    const initialState = {
        tripTitle: '',
        country: '',
        startDate: '',
        endDate: '',
        hashtags: [],
        ownerNickname: '',
        meidaFilesDates: [],
    };

    const queryClient = useQueryClient();

    const [tripInfo, setTripInfo] =
        // useState<Omit<Trip, 'tripId' | 'ownerNickname' | 'sharedUserNicknames'>>(initialState);
        useState<Trip>(initialState);
    const [isUploading, setIsUploading] = useState(false);
    const [isFormComplete, setIsFormComplete] = useState(false);

    const uploadStatus = useUploadStore((state) => state.uploadStatus);
    const waitForCompletion = useUploadStore((state) => state.waitForCompletion);
    const setIsTripInfoEditing = useUserDataStore((state) => state.setIsTripInfoEditing);
    const showToast = useToastStore((state) => state.showToast);

    const { tripId } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation();

    useEffect(() => {
        if (mode !== 'edit') {
            setTripInfo(() => {
                return {
                    ...tripInfo,
                    // startDate: state[0],
                    // endDate: state[state.length - 1],
                    meidaFilesDates: state,
                };
            });
        }
    }, [state]);

    const { data: tripInfoData, isLoading } = useTripTicketInfo(tripId as string, !!tripId && mode === 'edit');

    useEffect(() => {
        const { tripTitle, country, startDate, endDate, hashtags } = tripInfo;
        if (hashtags.length > 0 && tripTitle && country && startDate && endDate) {
            setIsFormComplete(true);
            return;
        }
        setIsFormComplete(false);
    }, [tripInfo]);

    useEffect(() => {
        if (mode === 'edit' && tripInfoData) {
            const { tripId: _, ...rest } = tripInfoData;
            setTripInfo(rest);
        }
    }, [tripInfoData, mode, showToast]);

    const handleTripInfoSubmit = async () => {
        if (!tripId) {
            return;
        }

        if (mode === 'create') {
            await tripAPI.updateTripTicketInfo(tripId, tripInfo);
            await tripAPI.finalizeTripTicekt(tripId);

            setIsUploading(true);
            await waitForCompletion();
            setIsUploading(false);

            localStorage.removeItem('image-date');
            queryClient.invalidateQueries({ queryKey: ['ticket-list'] });

            navigate(ROUTES.PATH.TRIPS.ROOT);
            showToast(
                uploadStatus === 'error'
                    ? '사진 등록이 실패했습니다. 다시 추가해 주세요.'
                    : '새로운 여행이 등록되었습니다.',
            );
        } else {
            try {
                await tripAPI.updateTripTicketInfo(tripId, tripInfo);
                queryClient.invalidateQueries({ queryKey: ['ticket-list'] });
                queryClient.invalidateQueries({ queryKey: ['ticket-info'] });

                showToast('여행 정보가 성공적으로 수정되었습니다.');
            } catch (error) {
                showToast('여행 정보 수정에 실패했습니다. 다시 시도해 주세요.');
            } finally {
                navigate(ROUTES.PATH.TRIPS.ROOT);
                setIsTripInfoEditing(false);
            }
        }
    };

    const navigateBeforePage = () => {
        if (mode === 'create') {
            navigate(`${ROUTES.PATH.TRIPS.NEW.IMAGES(Number(tripId))}`);
        } else {
            setIsTripInfoEditing(false);
            navigate(ROUTES.PATH.TRIPS.ROOT);
        }
    };

    return { tripInfo, setTripInfo, isLoading, isUploading, isFormComplete, handleTripInfoSubmit, navigateBeforePage };
};
