import { useState } from 'react';

import { css } from '@emotion/react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import ProcessingStep from '@/domains/media/components/upload/ProcessingStep';
import ReviewStep from '@/domains/media/components/upload/ReviewStep';
import UploadStep from '@/domains/media/components/upload/UploadStep';
import { useImageUpload } from '@/domains/media/hooks/useImageUpload';
import { ImageUploadStepType } from '@/domains/media/types';
import { getTitleByStep } from '@/domains/media/utils';
import Header from '@/shared/components/common/Header';
import ConfirmModal from '@/shared/components/common/Modal/ConfirmModal';
import ProgressHeader from '@/shared/components/common/ProgressHeader';
import { ROUTES } from '@/shared/constants/route';
import { COLORS } from '@/shared/constants/style';
import useBrowserCheck from '@/shared/hooks/useBrowserCheck';
import { useToastStore } from '@/shared/stores/useToastStore';

const TripImageUploadPage = () => {
    const [step, setStep] = useState<ImageUploadStepType>('upload');
    const showToast = useToastStore((state) => state.showToast);

    const { isModalOpen, closeModal } = useBrowserCheck();
    const { images, currentProcess, progress, extractMetaData, optimizeImages, uploadImagesToS3 } = useImageUpload();
    // const { images, progress, isProcessing, extractMetaData, uploadImages } = useImageUpload();

    const { tripKey } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const isEdit = searchParams.get('edit') !== null;

    // const closeAlertModal = async () => {
    //     if (images) {
    //         setIsUploadModalModalOpen(false);

    //         if (isEdit) {
    //             setIsUploading(true);
    //             await waitForCompletion();
    //             setIsUploading(true);

    //             navigate(`${ROUTES.PATH.MAIN}`);
    //             showToast(`${images.totalImages.length}장의 사진이 등록되었습니다.`);
    //             return;
    //         }

    //         const imageDates = [...images.completeImages, ...images.imagesWithoutDate].map(
    //             (image) => image.recordDate.split('T')[0],
    //         );
    //         const uniqueDates = Array.from(new Set(imageDates)).sort(
    //             (dateA, dateB) => new Date(dateA).getTime() - new Date(dateB).getTime(),
    //         );

    //         navigate(`${ROUTES.PATH.TRIP.MANAGEMENT.INFO(tripKey!)}`, { state: uniqueDates });
    //         return;
    //     } else {
    //         setIsUploadModalModalOpen(false);
    //         showToast('등록 가능한 사진이 없습니다.');
    //     }
    // };

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

    const imagesWithoutDateCount = images?.imagesWithoutDate.length || 0;
    const imagesWithoutLocation = images?.imagesWithoutLocation.length || 0;

    const renderMainSectionByStep = (step: ImageUploadStepType) => {
        switch (step) {
            case 'upload':
                return <UploadStep onImageSelect={handleImageUpload} />;
            case 'processing':
                return <ProcessingStep currentProcess={currentProcess} progress={progress} />;
            case 'review':
                return <ReviewStep />;
        }
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
    /* background: ${COLORS.BACKGROUND.WHITE_SECONDARY}; */
`;

const titleStyle = css`
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    font-weight: 600;
    color: ${COLORS.TEXT.BLACK};
`;

export default TripImageUploadPage;
