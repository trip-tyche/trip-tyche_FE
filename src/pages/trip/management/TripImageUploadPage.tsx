import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import ProcessingStep from '@/domains/media/components/upload/ProcessingStep';
import ReviewStep from '@/domains/media/components/upload/ReviewStep';
import TripCreateCompleteStep from '@/domains/media/components/upload/TripCreateCompleteStep';
import UploadStep from '@/domains/media/components/upload/UploadStep';
import { useImageUpload } from '@/domains/media/hooks/useImageUpload';
import { ImageUploadStepType, ImageWithAddress } from '@/domains/media/types';
import { getAddressFromImageLocation, getImageDateFromImage, getTitleByStep } from '@/domains/media/utils';
import TripInfoForm from '@/domains/trip/components/TripInfoForm';
import { FORM } from '@/domains/trip/constants';
import { useTripInfoForm } from '@/domains/trip/hooks/useTripInfoForm';
import { TripInfo } from '@/domains/trip/types';
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

const TripImageUploadPage = () => {
    const [step, setStep] = useState<ImageUploadStepType>('upload');
    const [imagesWithAddress, setImagesWithAddress] = useState<ImageWithAddress[]>([]);
    const [tripInfo, setTripInfo] = useState<TripInfo>(FORM.INITIAL);

    const { isModalOpen, closeModal } = useBrowserCheck();
    const { isSubmitting, isFormComplete, submitTripInfo } = useTripInfoForm(false, tripInfo);
    const { images, imageCount, currentProcess, progress, extractMetaData, optimizeImages, uploadImagesToS3 } =
        useImageUpload();
    const { isMapScriptLoaded } = useMapScript();

    const { tripKey } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const isEdit = searchParams.get('edit') !== null;

    useEffect(() => {
        const getAddressFromLocation = async () => {
            if (images && isMapScriptLoaded) {
                const imagesWithAddress = await Promise.all(
                    images.map(async (image) => {
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

    useEffect(() => {
        const imageDates = getImageDateFromImage(images || null);

        setTripInfo({
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
                        <TripInfoForm tripInfo={tripInfo} onChangeTripInfo={setTripInfo} />
                        <div css={buttonWrapper}>
                            <Button
                                text={`여행 등록하기`}
                                onClick={async () => {
                                    await submitTripInfo(tripInfo);
                                    setStep('done');
                                }}
                                disabled={!isFormComplete}
                            />
                        </div>
                    </div>
                );
            case 'done':
                return <TripCreateCompleteStep tripInfo={tripInfo} />;
        }
    };

    console.log('imagesWithAddress', imagesWithAddress);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedImages = event.target.files;
        if (selectedImages) {
            setStep('processing');
            const imagesWithMetadata = await extractMetaData(selectedImages);
            const optimizedImages = await optimizeImages(imagesWithMetadata);
            await uploadImagesToS3(optimizedImages);
            setStep('review');
        }
    };

    const estimatedStartDate = tripInfo.mediaFilesDates?.length ? formatHyphenToDot(tripInfo.mediaFilesDates[0]) : '';
    const estimatedEndDate = tripInfo.mediaFilesDates?.length
        ? formatHyphenToDot(tripInfo.mediaFilesDates[tripInfo.mediaFilesDates.length - 1])
        : '';

    const isCreateDone = step === 'done';

    return (
        <div css={page}>
            {isSubmitting && <Indicator text='여행 등록 중...' />}
            <Header
                title={`새로운 ${isEdit ? '사진' : '여행'} 등록`}
                isBackButton
                onBack={() =>
                    isEdit ? navigate(ROUTES.PATH.TRIP.MANAGEMENT.IMAGES(tripKey!)) : navigate(ROUTES.PATH.MAIN)
                }
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
