import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import ProcessingStep from '@/domains/media/components/upload/ProcessingStep';
import ReviewStep from '@/domains/media/components/upload/ReviewStep';
import TripCreateCompleteStep from '@/domains/media/components/upload/TripCreateCompleteStep';
import UploadStep from '@/domains/media/components/upload/UploadStep';
import { useImageUpload } from '@/domains/media/hooks/useImageUpload';
import { ImageFile, ImageUploadStepType, ImageWithAddress } from '@/domains/media/types';
import { getAddressFromImageLocation, getImageDateFromImage, getTitleByStep } from '@/domains/media/utils';
import TripInfoForm from '@/domains/trip/components/TripInfoForm';
import { FORM } from '@/domains/trip/constants';
import { useTripFormSubmit } from '@/domains/trip/hooks/mutations';
import { useTripFormValidation } from '@/domains/trip/hooks/useTripFormValidation';
import { TripInfo } from '@/domains/trip/types';
import { mediaAPI, tripAPI } from '@/libs/apis';
import { toResult } from '@/libs/apis/shared/utils';
import { formatHyphenToDot } from '@/libs/utils/date';
import Button from '@/shared/components/common/Button';
import Header from '@/shared/components/common/Header';
import ConfirmModal from '@/shared/components/common/Modal/ConfirmModal';
import ProgressHeader from '@/shared/components/common/ProgressHeader';
import Indicator from '@/shared/components/common/Spinner/Indicator';
import { ROUTES } from '@/shared/constants/route';
import { COLORS } from '@/shared/constants/style';
import useBrowserCheck from '@/shared/hooks/useBrowserCheck';
import { useMapScript } from '@/shared/hooks/useMapScript';
import { useToastStore } from '@/shared/stores/useToastStore';

const TripImageUploadPage = () => {
    const [step, setStep] = useState<ImageUploadStepType>('upload');
    const [imagesWithAddress, setImagesWithAddress] = useState<ImageWithAddress[]>([]);
    const [tripForm, setTripForm] = useState<TripInfo>(FORM.INITIAL);

    const { isModalOpen, closeModal } = useBrowserCheck();
    const { isFormComplete } = useTripFormValidation(tripForm);
    // const { isSubmitting, isFormComplete, submitTripInfo } = useTripInfoForm(false, tripForm);
    const { images, imageCount, currentProcess, progress, extractMetaData, optimizeImages, uploadImagesToS3 } =
        useImageUpload();
    const { isMapScriptLoaded } = useMapScript();
    const showToast = useToastStore((state) => state.showToast);

    const { mutateAsync, isPending: isSubmitting } = useTripFormSubmit();

    const { tripKey } = useParams();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    // 이미지 메타데이터 기반 역지오코딩을 활용한 좌표정보 주소 반환
    useEffect(() => {
        const getAddressFromLocation = async () => {
            if (images && isMapScriptLoaded) {
                const imagesWithAddress = await Promise.all(
                    images.map(async (image: ImageFile) => {
                        // console.log('location: ', image.location);
                        // console.log('recordDate: ', image.recordDate);
                        const address = image.location ? await getAddressFromImageLocation(image.location) : '';
                        const formattedAddress = address ? `${address.split(' ')[0]}, ${address.split(' ')[1]}` : '';
                        const blobUrl = URL.createObjectURL(image.image);

                        return {
                            imageUrl: blobUrl,
                            recordDate: image.recordDate,
                            address: formattedAddress,
                        };
                    }),
                );

                setImagesWithAddress(imagesWithAddress);
            }
        };

        getAddressFromLocation();
    }, [images, isMapScriptLoaded]);

    // tripInfo에 업로드한 이미지에서 추출한 mediaFilesDates 추가
    useEffect(() => {
        const imageDates = getImageDateFromImage(images || null);

        setTripForm({
            tripTitle: '',
            country: '',
            startDate: '',
            endDate: '',
            hashtags: [],
            mediaFilesDates: imageDates ? imageDates : [],
        });
    }, [images]);

    const renderMainSectionByStep = (step: ImageUploadStepType) => {
        switch (step) {
            case 'upload':
                return <UploadStep onImageSelect={handleImageUpload} />;
            case 'processing':
                return <ProcessingStep currentProcess={currentProcess} progress={progress} />;
            case 'review':
                return (
                    <div>
                        <ReviewStep
                            imageCount={imageCount!}
                            tripPeriod={[estimatedStartDate, estimatedEndDate]}
                            imagesWithAddress={imagesWithAddress}
                        />
                        <div css={buttonWrapper}>
                            <Button text='여행 정보 입력하기' onClick={() => setStep('info')} />
                        </div>
                    </div>
                );
            case 'info':
                return (
                    <div css={infoSectionContainer}>
                        <TripInfoForm tripForm={tripForm} onChangeTripInfo={setTripForm} />
                        <div css={buttonWrapper}>
                            <Button text={`여행 등록하기`} onClick={handleTripFormSubmit} disabled={!isFormComplete} />
                        </div>
                    </div>
                );
            case 'done':
                return <TripCreateCompleteStep tripInfo={tripForm} />;
        }
    };

    // 여행 확정
    const finalizeTrip = async () => {
        if (!tripKey) return;

        const result = await toResult(() => tripAPI.finalizeTripTicket(tripKey));
        if (result && !result.success) {
            showToast(result.error);
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedImages = event.target.files;
        if (selectedImages) {
            setStep('processing');
            const imagesWithMetadata = await extractMetaData(selectedImages);
            const optimizedImages = await optimizeImages(imagesWithMetadata);
            await uploadImagesToS3(optimizedImages);
            setStep('review');

            if (!isEdit) {
                const result = await toResult(async () => await mediaAPI.updateTripStatusToImagesUploaded(tripKey!));
                if (!result.success) {
                    showToast(result.error);
                }
            }
        }
    };

    const handleTripFormSubmit = async () => {
        if (!tripKey) return;

        const result = await mutateAsync({ tripKey, tripForm });
        if (result.success) {
            await finalizeTrip();
            setStep('done');
        } else {
            showToast(result.error);
        }
    };

    const estimatedStartDate = tripForm.mediaFilesDates?.length ? formatHyphenToDot(tripForm.mediaFilesDates[0]) : '';
    const estimatedEndDate = tripForm.mediaFilesDates?.length
        ? formatHyphenToDot(tripForm.mediaFilesDates[tripForm.mediaFilesDates.length - 1])
        : '';

    const isCreateDone = step === 'done';
    const isEdit = pathname.includes('edit');

    return (
        <div css={page}>
            {isSubmitting && <Indicator text='여행 등록 중...' />}
            <Header
                title={`새로운 ${isEdit ? '사진' : '여행'} 등록`}
                isBackButton
                onBack={() => (isEdit ? navigate(ROUTES.PATH.TRIP.EDIT.IMAGE(tripKey!)) : navigate(ROUTES.PATH.MAIN))}
            />

            {!isCreateDone && <ProgressHeader currentStep={step} />}
            <main css={mainStyle}>
                {getTitleByStep(step) && <h2 css={titleStyle}>{getTitleByStep(step)}</h2>}
                {renderMainSectionByStep(step)}
            </main>

            {isModalOpen && (
                <ConfirmModal
                    title='더 나은 경험을 위한 안내'
                    description='안드로이드 환경에서는 사진 업로드가 제한될 수 있어요. 데스크탑으로 접속해주세요!'
                    confirmText='알겠어요'
                    cancelText='계속 진행할래요'
                    confirmModal={() => {
                        closeModal();
                        navigate(-1);
                    }}
                    closeModal={closeModal}
                />
            )}
        </div>
    );
};

const page = css`
    height: 100dvh;
    display: flex;
    flex-direction: column;
`;

const mainStyle = css`
    flex: 1;
    height: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
`;

const titleStyle = css`
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    font-weight: 600;
    color: ${COLORS.TEXT.BLACK};
`;

const infoSectionContainer = css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const buttonWrapper = css`
    margin-top: 36px;
`;

export default TripImageUploadPage;
