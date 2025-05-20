// import { useEffect, useState } from 'react';

// import { useQueryClient } from '@tanstack/react-query';
// import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

// import { useTripUpdate } from '@/domains/trip/hooks/mutations';
// import { TripInfo } from '@/domains/trip/types';
// import { tripAPI } from '@/libs/apis';
// import { toResult } from '@/libs/apis/shared/utils';
// import { validateFormComplete } from '@/libs/utils/validate';
// import { ROUTES } from '@/shared/constants/route';
// import { MESSAGE } from '@/shared/constants/ui';
// import { useToastStore } from '@/shared/stores/useToastStore';

// export const useTripInfoForm = (
//     isEditing: boolean,
//     form: TripInfo,
//     // callback?: {
//     //     onSuccess?: () => void;
//     //     onError?: (error: string) => void;
//     // },
// ) => {
//     const [isFormComplete, setIsFormComplete] = useState(false);
//     const showToast = useToastStore((state) => state.showToast);

//     const navigate = useNavigate();
//     const { tripKey } = useParams();
//     const [searchParams] = useSearchParams();

//     // const { onError } = callback || {};
//     const isUnCompletedTrip = searchParams.get('isUnCompleted') !== null;

//     const queryClient = useQueryClient();

//     const { mutateAsync, isPending: isSubmitting } = useTripUpdate();

//     useEffect(() => {
//         if (validateFormComplete(form)) {
//             setIsFormComplete(true);
//             return;
//         }
//         setIsFormComplete(false);
//     }, [form]);

//     const submitTripInfo = async (form: TripInfo) => {
//         if (!tripKey || !form) return;

//         try {
//             const updateResult = await mutateAsync({ tripKey, form });
//             if (!updateResult.success) throw Error(updateResult.error);

//             if (isEditing) {
//                 if (isUnCompletedTrip) {
//                     finalizeTrip();
//                     showToast('여행이 성공적으로 등록되었습니다');
//                     navigate(ROUTES.PATH.MAIN);
//                     queryClient.invalidateQueries({ queryKey: ['ticket-list'] });
//                 }
//                 queryClient.invalidateQueries({ queryKey: ['ticket-info'] });
//                 showToast('여행 정보가 성공적으로 수정되었습니다');
//                 navigate(ROUTES.PATH.MAIN);
//                 queryClient.invalidateQueries({ queryKey: ['ticket-list'] });
//             } else {
//                 finalizeTrip();
//                 showToast('새로운 여행이 등록되었습니다');
//                 queryClient.invalidateQueries({ queryKey: ['ticket-list'] });
//             }
//         } catch (error) {
//             const errorMessage =
//                 error instanceof Error
//                     ? isEditing
//                         ? '여행 정보 수정에 실패했습니다. 다시 시도해 주세요.'
//                         : error.message
//                     : MESSAGE.ERROR.UNKNOWN;
//             showToast(errorMessage);
//         }
//     };

//     const finalizeTrip = async () => {
//         try {
//             const result = await toResult(() => tripAPI.finalizeTripTicket(tripKey!));
//             if (!result.success) throw Error(result.error);
//             return result.data;
//         } catch (error) {
//             if (error instanceof Error) {
//                 // onError?.(error.message);
//                 showToast(error.message);
//             }
//         }
//     };

//     return { isSubmitting, isFormComplete, submitTripInfo };
// };
