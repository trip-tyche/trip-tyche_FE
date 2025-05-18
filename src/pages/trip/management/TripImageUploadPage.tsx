import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import ProcessingStep from '@/domains/media/components/upload/ProcessingStep';
import ReviewStep from '@/domains/media/components/upload/ReviewStep';
import UploadStep from '@/domains/media/components/upload/UploadStep';
import { useImageUpload } from '@/domains/media/hooks/useImageUpload';
import { ImageUploadStepType, ImageWithAddress } from '@/domains/media/types';
import { getAddressFromImageLocation, getImageDateFromImage, getTitleByStep } from '@/domains/media/utils';
import { formatHyphenToDot } from '@/libs/utils/date';
import Header from '@/shared/components/common/Header';
import ConfirmModal from '@/shared/components/common/Modal/ConfirmModal';
import ProgressHeader from '@/shared/components/common/ProgressHeader';
import { ROUTES } from '@/shared/constants/route';
import { COLORS } from '@/shared/constants/style';
import useBrowserCheck from '@/shared/hooks/useBrowserCheck';
import { useMapScript } from '@/shared/hooks/useMapScript';

const TripImageUploadPage = () => {
    const [step, setStep] = useState<ImageUploadStepType>('upload');
    const [imagesWithAddress, setImagesWithAddress] = useState<ImageWithAddress[]>([]);

    const { isModalOpen, closeModal } = useBrowserCheck();
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

    const renderMainSectionByStep = (step: ImageUploadStepType) => {
        switch (step) {
            case 'upload':
                return <UploadStep onImageSelect={handleImageUpload} />;
            case 'processing':
                return <ProcessingStep currentProcess={currentProcess} progress={progress} />;
            case 'review':
                return (
                    <ReviewStep
                        imageCount={imageCount!}
                        tripPeriod={[startDate, endDate]}
                        imagesWithAddress={imagesWithAddress}
                    />
                );
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
        }
    };

    const imageDates = getImageDateFromImage(images || null);
    const startDate = imageDates?.length ? formatHyphenToDot(imageDates[0]) : '';
    const endDate = imageDates?.length ? formatHyphenToDot(imageDates[imageDates.length - 1]) : '';

    return (
        <div css={page}>
            <Header
                title={`새로운 ${isEdit ? '사진' : '여행'} 등록`}
                isBackButton
                onBack={() =>
                    isEdit ? navigate(ROUTES.PATH.TRIP.MANAGEMENT.IMAGES(tripKey!)) : navigate(ROUTES.PATH.MAIN)
                }
            />

            <ProgressHeader currentStep={step} />
            <main css={mainStyle}>
                <h2 css={titleStyle}>{getTitleByStep(step)}</h2>
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

export default TripImageUploadPage;
