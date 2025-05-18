import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import ProcessingStep from '@/domains/media/components/upload/ProcessingStep';
import ReviewStep from '@/domains/media/components/upload/ReviewStep';
import UploadStep from '@/domains/media/components/upload/UploadStep';
import { useImageUpload } from '@/domains/media/hooks/useImageUpload';
import { ImageFile, ImagesFiles, ImageUploadStepType } from '@/domains/media/types';
import { getTitleByStep, removeDuplicateDates } from '@/domains/media/utils';
import { getAddressFromLocation } from '@/libs/utils/map';
import Header from '@/shared/components/common/Header';
import ConfirmModal from '@/shared/components/common/Modal/ConfirmModal';
import ProgressHeader from '@/shared/components/common/ProgressHeader';
import { ROUTES } from '@/shared/constants/route';
import { COLORS } from '@/shared/constants/style';
import useBrowserCheck from '@/shared/hooks/useBrowserCheck';
import { useMapControl } from '@/shared/hooks/useMapControl';

const TripImageUploadPage = () => {
    const [step, setStep] = useState<ImageUploadStepType>('upload');
    const [location, setLocation] = useState<{ image: ImageFile; imageName: string; address: string }[]>([]);

    const { isModalOpen, closeModal } = useBrowserCheck();
    const { images, currentProcess, progress, extractMetaData, optimizeImages, uploadImagesToS3 } = useImageUpload();
    const { isMapScriptLoaded } = useMapControl(null, null);
    const { tripKey } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const isEdit = searchParams.get('edit') !== null;

    useEffect(() => {
        const getLocation = async () => {
            if (images && isMapScriptLoaded) {
                const promise = images.totalImages.map(async (image) => {
                    const address = await getGeocoderFromImages(image);

                    return {
                        image,
                        imageName: image.image.name,
                        address: address?.data || '',
                    };
                });
                const result = await Promise.all(promise);
                // console.log('result: ', result);
                setLocation(result);
            }
        };

        getLocation();
    }, [images, isMapScriptLoaded]);

    const getGeocoderFromImages = async (image: ImageFile | null) => {
        if (images) {
            return await getAddressFromLocation(image?.location?.latitude || 0, image?.location?.longitude || 0);
        } else {
            return null;
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

    const renderMainSectionByStep = (step: ImageUploadStepType) => {
        switch (step) {
            case 'upload':
                return <UploadStep onImageSelect={handleImageUpload} />;
            case 'processing':
                return <ProcessingStep currentProcess={currentProcess} progress={progress} />;
            case 'review':
                return (
                    <ReviewStep
                        images={images!}
                        imageDates={getImageDates(images?.totalImages || null)}
                        location={location.sort((a, b) => {
                            return new Date(a.image.recordDate).getTime() - new Date(b.image.recordDate).getTime();
                        })}
                    />
                );
        }
    };

    const getImageDates = (images: ImageFile[] | null) => {
        if (images?.length === 0) {
            return null;
        }
        const imageDates = images?.map((image: ImageFile) => image.recordDate.split('T')[0]) || [];
        return removeDuplicateDates(imageDates).filter((date) => date);
    };

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
