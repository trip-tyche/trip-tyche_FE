import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import ProcessingStep from '@/domains/media/components/upload/ProcessingStep';
import ReviewStep from '@/domains/media/components/upload/ReviewStep';
import UploadStep from '@/domains/media/components/upload/UploadStep';
import { useImageUpload } from '@/domains/media/hooks/useImageUpload';
import { ClientImageFile, ImageFileWithAddress, ImageUploadStepType } from '@/domains/media/types';
import { getAddressFromImageLocation, getImageDateFromImage, getTitleByStep } from '@/domains/media/utils';
import { FORM } from '@/domains/trip/constants';
import { TripInfo } from '@/domains/trip/types';
import { mediaAPI } from '@/libs/apis';
import { toResult } from '@/libs/apis/shared/utils';
import { formatHyphenToDot } from '@/libs/utils/date';
import Button from '@/shared/components/common/Button';
import Header from '@/shared/components/common/Header';
import ConfirmModal from '@/shared/components/common/Modal/ConfirmModal';
import { COLORS } from '@/shared/constants/style';
import useBrowserCheck from '@/shared/hooks/useBrowserCheck';
import { useMapScript } from '@/shared/hooks/useMapScript';
import { useToastStore } from '@/shared/stores/useToastStore';

const TripImageUploadPageS = ({ onClose }: { onClose: () => void }) => {
    const [step, setStep] = useState<ImageUploadStepType>('upload');
    const [imagesWithAddress, setImagesWithAddress] = useState<ImageFileWithAddress[]>([]);
    const [tripForm, setTripForm] = useState<TripInfo>(FORM.INITIAL);

    const { isModalOpen, closeModal } = useBrowserCheck();
    const { images, imageCategories, currentProcess, progress, extractMetaData, optimizeImages, uploadImagesToS3 } =
        useImageUpload();
    const { isMapScriptLoaded } = useMapScript();
    const showToast = useToastStore((state) => state.showToast);

    const queryClient = useQueryClient();

    const { tripKey } = useParams();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    // 이미지 메타데이터 기반 역지오코딩을 활용한 좌표정보 주소 반환
    useEffect(() => {
        const getAddressFromLocation = async () => {
            if (images && isMapScriptLoaded) {
                const imagesWithAddress = await Promise.all(
                    images.map(async (image: ClientImageFile) => {
                        const address =
                            image.latitude && image.longitude
                                ? await getAddressFromImageLocation({
                                      latitude: image.latitude,
                                      longitude: image.longitude,
                                  })
                                : '';
                        const formattedAddress = address ? `${address.split(' ')[0]}, ${address.split(' ')[1]}` : '';
                        const blobUrl = URL.createObjectURL(image.image);

                        return {
                            ...image,
                            mediaFileId: image.image.name,
                            mediaLink: blobUrl,
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
                            imageCategories={imageCategories!}
                            tripPeriod={[estimatedStartDate, estimatedEndDate]}
                            imagesWithAddress={imagesWithAddress}
                        />
                        <div css={buttonWrapper}>
                            <Button
                                text='사진 관리로 돌아가기'
                                onClick={() => {
                                    queryClient.invalidateQueries({ queryKey: ['trip-images', tripKey] });
                                    onClose();
                                }}
                            />
                        </div>
                    </div>
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
            await queryClient.invalidateQueries({ queryKey: ['trip-images', tripKey] });
            setStep('review');

            if (!isEdit) {
                const result = await toResult(async () => await mediaAPI.updateTripStatusToImagesUploaded(tripKey!));
                if (!result.success) {
                    showToast(result.error);
                }
            }
        }
    };

    const estimatedStartDate = tripForm.mediaFilesDates?.length ? formatHyphenToDot(tripForm.mediaFilesDates[0]) : '';
    const estimatedEndDate = tripForm.mediaFilesDates?.length
        ? formatHyphenToDot(tripForm.mediaFilesDates[tripForm.mediaFilesDates.length - 1])
        : '';

    const isEdit = pathname.includes('edit');

    return (
        <div css={page}>
            <Header title={`새로운 ${isEdit ? '사진' : '여행'} 등록`} isBackButton onBack={() => onClose()} />

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
    z-index: 999;
    background-color: ${COLORS.BACKGROUND.WHITE};
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

const buttonWrapper = css`
    margin-top: 36px;
`;

export default TripImageUploadPageS;
