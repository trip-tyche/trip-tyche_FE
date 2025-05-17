import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import MediaUploadSection from '@/domains/media/components/MediaUploadSection';
import { useImageUpload } from '@/domains/media/hooks/useImageUpload';
import Guide from '@/shared/components/common/Guide';
import Header from '@/shared/components/common/Header';
import AlertModal from '@/shared/components/common/Modal/AlertModal';
import ConfirmModal from '@/shared/components/common/Modal/ConfirmModal';
import ProgressHeader from '@/shared/components/common/ProgressHeader';
import Indicator from '@/shared/components/common/Spinner/Indicator';
import { ROUTES } from '@/shared/constants/route';
import { COLORS } from '@/shared/constants/style';
import { GUIDE_MESSAGE, MESSAGE } from '@/shared/constants/ui';
import useBrowserCheck from '@/shared/hooks/useBrowserCheck';
import { useToastStore } from '@/shared/stores/useToastStore';
import { useUploadStatusStore } from '@/shared/stores/useUploadStatusStore';
import theme from '@/shared/styles/theme';

const TripImageUploadPage = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [isUploadModalOpen, setIsUploadModalModalOpen] = useState(false);
    const waitForCompletion = useUploadStatusStore((state) => state.waitForCompletion);
    const resetUpload = useUploadStatusStore((state) => state.resetUpload);
    const showToast = useToastStore((state) => state.showToast);

    const { isModalOpen, closeModal } = useBrowserCheck();

    const { images, extractMetaData, uploadImages } = useImageUpload();
    // const { images, progress, isProcessing, extractMetaData, uploadImages } = useImageUpload();

    const { tripKey } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const isEdit = searchParams.get('edit') !== null;

    useEffect(() => {
        resetUpload();
    }, []);

    const closeAlertModal = async () => {
        if (images) {
            uploadImages();
            setIsUploadModalModalOpen(false);

            if (isEdit) {
                setIsUploading(true);
                await waitForCompletion();
                setIsUploading(true);

                navigate(`${ROUTES.PATH.MAIN}`);
                showToast(`${images.totalImages.length}장의 사진이 등록되었습니다.`);
                return;
            }

            const imageDates = [...images.completeImages, ...images.imagesWithoutDate].map(
                (image) => image.recordDate.split('T')[0],
            );
            const uniqueDates = Array.from(new Set(imageDates)).sort(
                (dateA, dateB) => new Date(dateA).getTime() - new Date(dateB).getTime(),
            );

            navigate(`${ROUTES.PATH.TRIP.MANAGEMENT.INFO(tripKey!)}`, { state: uniqueDates });
            return;
        } else {
            setIsUploadModalModalOpen(false);
            showToast('등록 가능한 사진이 없습니다.');
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            await extractMetaData(event.target.files);
            setIsUploadModalModalOpen(true);
        }
    };

    // const imagesWithoutDateCount = images?.imagesWithoutDate.length || 0;
    // const imagesWithoutLocation = images?.imagesWithoutLocation.length || 0;
    // const hasInvalidImages = !!(imagesWithoutDateCount + imagesWithoutLocation);

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

            <ProgressHeader currentStep='upload' />

            {/* <section css={sectionStyle}>
                    <h4>[사진 등록 가이드]</h4>
                    <p>1. 중복된 사진들의 경우, 1장으로 등록됩니다.</p>
                    <p>2. 날짜 및 위치 정보가 없는 사진은 나중에 직접 등록하실 수 있습니다.</p>
                    <p>3. 여행 중 찍은 사진을 모두 선택하면 자동으로 여정이 생성됩니다.</p>

                    <div css={uploadAreaStyle}>
                        <input
                            type='file'
                            accept='image/*,.heic'
                            multiple
                            onChange={async (event) => {
                                await extractMetaData(event.target.files);
                                setIsUploadModalModalOpen(true);
                            }}
                            css={fileInputStyle}
                            id='imageUpload'
                        />
                        {!isProcessing ? (
                            <label htmlFor='imageUpload' css={uploadLabelStyle}>
                                <ImageUp size={32} />
                                <span css={uploadedStyle}>{MESSAGE.TRIP_IMAGES_UPLOAD.message}</span>
                            </label>
                        ) : (
                            <label htmlFor='imageUpload' css={uploadLabelStyle}>
                                <Progress
                                    color={COLORS.PRIMARY}
                                    radius='xl'
                                    size='xl'
                                    value={progress}
                                    striped
                                    animated
                                    style={{ width: '300px' }}
                                />
                                <h3
                                    css={uploadedStyle}
                                >{`사진에서 위치, 날짜 정보를 찾고 있습니다... (${progress}%)`}</h3>
                            </label>
                        )}
                    </div>
                </section> */}
            <main css={mainStyle}>
                <h2 css={titleStyle}>여행 사진 등록</h2>
                <Guide title='사진 등록 가이드' texts={GUIDE_MESSAGE.IMAGE_UPLOAD} />
                <MediaUploadSection onImageSelect={handleImageUpload} />
                <p css={quoteText}>{MESSAGE.QUOTE}</p>
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
    background: ${COLORS.BACKGROUND.WHITE_SECONDARY};
`;

const titleStyle = css`
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    font-weight: 600;
    color: ${COLORS.TEXT.BLACK};
`;

const quoteText = css`
    margin-top: 16px;
    text-align: center;
    font-size: 12px;
    color: #6b7280;
    font-style: italic;
`;

export default TripImageUploadPage;
