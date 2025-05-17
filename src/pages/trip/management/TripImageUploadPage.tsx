import { useState } from 'react';

import { css } from '@emotion/react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import ProcessingStep from '@/domains/media/components/upload/ProcessingStep';
import UploadStep from '@/domains/media/components/upload/UploadStep';
import { useImageUpload } from '@/domains/media/hooks/useImageUpload';
import { ImageUploadStepType } from '@/domains/media/types';
import { getTitleByStep } from '@/domains/media/utils';
import Header from '@/shared/components/common/Header';
import ConfirmModal from '@/shared/components/common/Modal/ConfirmModal';
import ProgressHeader from '@/shared/components/common/ProgressHeader';
import Indicator from '@/shared/components/common/Spinner/Indicator';
import { ROUTES } from '@/shared/constants/route';
import { COLORS } from '@/shared/constants/style';
import useBrowserCheck from '@/shared/hooks/useBrowserCheck';
import { useToastStore } from '@/shared/stores/useToastStore';

const TripImageUploadPage = () => {
    const [step, setStep] = useState<ImageUploadStepType>('processing');
    const [isUploading, setIsUploading] = useState(false);
    const [isUploadModalOpen, setIsUploadModalModalOpen] = useState(false);
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
            const result = await uploadImagesToS3(optimizedImages);

            setIsUploadModalModalOpen(true);
        }
    };

    // const imagesWithoutDateCount = images?.imagesWithoutDate.length || 0;
    // const imagesWithoutLocation = images?.imagesWithoutLocation.length || 0;
    // const hasInvalidImages = !!(imagesWithoutDateCount + imagesWithoutLocation);

    const renderMainSectionByStep = (step: ImageUploadStepType) => {
        switch (step) {
            case 'upload':
                return <UploadStep onImageSelect={handleImageUpload} />;
            case 'processing':
                return <ProcessingStep currentProcess={currentProcess} progress={progress} />;
            case 'review':
                return '정보 확인';
        }
    };

    return (
        <div css={page}>
            {isUploading && <Indicator />}

            <Header
                title={'사진 등록'}
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

            {/* {isUploadModalOpen && (
                <AlertModal confirmText='등록하기' confirmModal={closeAlertModal}>
                    <div css={alertStyle}>
                        <h1>
                            총 <span css={countStyle}>{images?.totalImages.length}</span>장의 사진을 등록할까요?
                        </h1>
                        <div>
                            {hasInvalidImages && (
                                <p>
                                    {imagesWithoutDateCount + imagesWithoutLocation} 장의 사진은 위치 또는 날짜 정보가
                                    없어요!
                                </p>
                            )}
                        </div>
                    </div>
                </AlertModal>
            )} */}
        </div>
    );
};

// const alertStyle = css`
//     h1 {
//         text-align: center;
//         font-size: 18px;
//         font-weight: 600;
//         color: #181818;
//         margin-top: 24px;
//         margin-bottom: 20px;
//     }

//     div {
//         font-size: 16px;
//         margin: 0 26px 34px 26px;
//         text-align: center;
//         color: ${theme.COLORS.TEXT.DESCRIPTION};
//         line-height: 20px;
//     }

//     p {
//         margin-top: 12px;
//     }
// `;

// const countStyle = css`
//     font-size: 18px;
//     font-weight: 600;
//     margin: 0 4px;
//     color: ${theme.COLORS.PRIMARY};
// `;

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

// import { useState, useEffect } from 'react';

// import { css } from '@emotion/react';
// import { Loader, AlertCircle } from 'lucide-react';

// import Progress from '@/shared/components/common/Progress';

// // 스타일 정의
// const containerStyle = css`
//     padding: 16px;
//     display: flex;
//     flex-direction: column;
//     height: 100%;
// `;

// const titleStyle = css`
//     font-size: 20px;
//     font-weight: 600;
//     margin-bottom: 24px;
// `;

// const progressContainerStyle = css`
//     margin-bottom: 24px;
// `;

// const progressLabelContainerStyle = css`
//     display: flex;
//     justify-content: space-between;
//     font-size: 14px;
//     color: #374151;
//     margin-bottom: 4px;
// `;

// const progressBarStyle = css`
//     height: 8px;
//     background-color: #e5e7eb;
//     border-radius: 9999px;
//     overflow: hidden;
// `;

// const getProgressFillStyle = (percentage: number) => css`
//     height: 100%;
//     background-color: #2563eb;
//     border-radius: 9999px;
//     width: ${percentage}%;
//     transition: width 0.3s ease;
// `;

// const currentProcessContainerStyle = css`
//     background-color: #eff6ff;
//     border-radius: 8px;
//     padding: 16px;
//     margin-bottom: 24px;
//     display: flex;
//     align-items: center;
// `;

// const spinnerContainerStyle = css`
//     margin-right: 12px;
// `;

// const loaderStyle = css`
//     width: 20px;
//     height: 20px;
//     color: #2563eb;
//     animation: spin 1s linear infinite;
// `;

// const processInfoContainerStyle = css`
//     display: flex;
//     flex-direction: column;
//     gap: 6px;
// `;

// const processTitleStyle = css`
//     font-weight: 500;
// `;

// const processDescriptionStyle = css`
//     font-size: 14px;
//     color: #4b5563;
// `;

// const progressContainer = css`
//     display: flex;
//     flex-direction: column;
//     gap: 16px;
//     margin-bottom: 24px;
// `;

// const infoContainerStyle = css`
//     margin-top: auto;
// `;

// const infoBoxStyle = css`
//     background-color: #f9fafb;
//     border-radius: 8px;
//     padding: 16px;
//     display: flex;
// `;

// const iconContainerStyle = css`
//     margin-right: 12px;
//     flex-shrink: 0;
//     margin-top: 2px;
// `;

// const alertCircleStyle = css`
//     width: 20px;
//     height: 20px;
//     color: #4b5563;
// `;

// const infoTextStyle = css`
//     font-size: 14px;
//     color: #374151;
//     line-height: 1.3;
// `;

// const TripImageUploadPage = () => {
//     const [currentProcessStep, setCurrentProcessStep] = useState('metadata');
//     const [metadataProgress, setMetadataProgress] = useState(0);
//     const [resizeProgress, setResizeProgress] = useState(0);
//     const [cloudUploadProgress, setCloudUploadProgress] = useState(0);

//     // useEffect(() => {
//     //     // 메타데이터 추출 (약 1초)
//     //     const metadataInterval = setInterval(() => {
//     //         setMetadataProgress((prev) => {
//     //             if (prev >= 100) {
//     //                 clearInterval(metadataInterval);
//     //                 setCurrentProcessStep('resize');
//     //                 return 100;
//     //             }
//     //             return prev + 10;
//     //         });
//     //     }, 100);

//     //     return () => {
//     //         clearInterval(metadataInterval);
//     //     };
//     // }, []);

//     // useEffect(() => {
//     //     if (currentProcessStep === 'resize') {
//     //         // 이미지 리사이징 (약 7초)
//     //         const resizeInterval = setInterval(() => {
//     //             setResizeProgress((prev) => {
//     //                 if (prev >= 100) {
//     //                     clearInterval(resizeInterval);
//     //                     setCurrentProcessStep('upload');
//     //                     return 100;
//     //                 }
//     //                 return prev + 2;
//     //             });
//     //         }, 140);

//     //         return () => {
//     //             clearInterval(resizeInterval);
//     //         };
//     //     }
//     // }, [currentProcessStep]);

//     // useEffect(() => {
//     //     if (currentProcessStep === 'upload') {
//     //         // 클라우드 업로드 (약 2초)
//     //         const uploadInterval = setInterval(() => {
//     //             setCloudUploadProgress((prev) => {
//     //                 if (prev >= 100) {
//     //                     clearInterval(uploadInterval);
//     //                     return 100;
//     //                 }
//     //                 return prev + 5;
//     //             });
//     //         }, 100);

//     //         return () => {
//     //             clearInterval(uploadInterval);
//     //         };
//     //     }
//     // }, [currentProcessStep]);

//     // 전체 진행률 계산

//     const getTotalProgress = () => {
//         if (currentProcessStep === 'metadata') {
//             return Math.floor(metadataProgress * 0.1);
//         } else if (currentProcessStep === 'resize') {
//             return 10 + Math.floor(resizeProgress * 0.75);
//         } else if (currentProcessStep === 'upload') {
//             return 70 + Math.floor(cloudUploadProgress * 0.15);
//         }
//         return 0;
//     };

//     return (
//         <div css={containerStyle}>
//             <h2 css={titleStyle}>사진 처리 중...</h2>

//             {/* 전체 진행률 */}
//             <div css={progressContainerStyle}>
//                 {/* <div css={progressLabelContainerStyle}>
//                     <span>전체 진행률</span>
//                     <span>{getTotalProgress()}%</span>
//                 </div>
//                 <div css={progressBarStyle}>
//                     <div css={getProgressFillStyle(getTotalProgress())} />
//                 </div> */}
//                 <Progress title='전체 진행률' count={getTotalProgress()} size='lg' />
//             </div>

//             {/* 현재 진행 중인 단계 */}
//             <div css={currentProcessContainerStyle}>
//                 <div css={spinnerContainerStyle}>
//                     <Loader css={loaderStyle} />
//                 </div>

//                 <div css={processInfoContainerStyle}>
//                     <p css={processTitleStyle}>
//                         {currentProcessStep === 'metadata' && '메타데이터 추출 중...'}
//                         {currentProcessStep === 'resize' && '이미지 최적화 중...'}
//                         {currentProcessStep === 'upload' && '클라우드에 업로드 중...'}
//                     </p>
//                     <p css={processDescriptionStyle}>
//                         {currentProcessStep === 'metadata' && '사진에서 위치와 날짜 정보를 추출하고 있습니다.'}
//                         {currentProcessStep === 'resize' && '사진을 최적화하여 용량을 줄이고 있습니다.'}
//                         {currentProcessStep === 'upload' && '처리된 사진을 안전하게 저장하고 있습니다.'}
//                     </p>
//                 </div>
//             </div>

//             {/* 세부 진행률 */}
//             <div css={progressContainer}>
//                 <Progress title='메타데이터 추출' count={metadataProgress} />
//                 <Progress title='이미지 최적화' count={currentProcessStep === 'metadata' ? 0 : resizeProgress} />
//                 <Progress
//                     title='클라우드 업로드'
//                     count={
//                         currentProcessStep === 'metadata' || currentProcessStep === 'resize' ? 0 : cloudUploadProgress
//                     }
//                 />
//             </div>

//             {/* 안내 메시지 */}
//             <div css={infoContainerStyle}>
//                 <div css={infoBoxStyle}>
//                     <div css={iconContainerStyle}>
//                         <AlertCircle css={alertCircleStyle} />
//                     </div>
//                     <p css={infoTextStyle}>
//                         처리 중에는 화면을 나가지 마세요. 이 과정은 약 10초 정도 소요됩니다. 위치 및 날짜 정보가 없는
//                         사진은 후에 수동으로 정보를 추가할 수 있습니다.
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TripImageUploadPage;
