import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { Progress } from '@mantine/core';
import { Camera, Heart, ImageUp, MapPin, Upload } from 'lucide-react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useImageUpload } from '@/domains/media/hooks/useImageUpload';
import Header from '@/shared/components/common/Header';
import AlertModal from '@/shared/components/common/Modal/AlertModal';
import ConfirmModal from '@/shared/components/common/Modal/ConfirmModal';
import ProgressHeader from '@/shared/components/common/ProgressHeader';
import Indicator from '@/shared/components/common/Spinner/Indicator';
import { ROUTES } from '@/shared/constants/route';
import { COLORS } from '@/shared/constants/style';
import { MESSAGE } from '@/shared/constants/ui';
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

    const { images, progress, isProcessing, extractMetaDataAndResizeImages, uploadImages } = useImageUpload();

    const { tripKey } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    const isFirstTicket = Boolean(location.state);
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

    const imagesWithoutDateCount = images?.imagesWithoutDate.length || 0;
    const imagesWithoutLocation = images?.imagesWithoutLocation.length || 0;
    const hasInvalidImages = !!(imagesWithoutDateCount + imagesWithoutLocation);

    return (
        <div css={page}>
            {isUploading && <Indicator />}

            <Header
                title={'사진 등록'}
                isBackButton
                onBack={() =>
                    isFirstTicket
                        ? navigate(ROUTES.PATH.MAIN)
                        : isEdit
                          ? navigate(ROUTES.PATH.TRIP.MANAGEMENT.IMAGES(tripKey!))
                          : navigate(ROUTES.PATH.MAIN)
                }
            />

            <ProgressHeader currentStep='upload' />

            <main css={mainStyle}>
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
                                await extractMetaDataAndResizeImages(event.target.files);
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
                <div
                    css={css`
                        padding: 16px;
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                        background: ${COLORS.BACKGROUND.WHITE_SECONDARY};
                    `}
                >
                    <h2
                        css={css`
                            font-weight: 600;
                            margin-bottom: 0.75rem;
                            color: ${COLORS.TEXT.BLACK};
                            display: flex;
                            align-items: center;
                        `}
                    >
                        여행 사진 등록
                    </h2>

                    <div
                        css={css`
                            font-size: 0.875rem;
                            color: #4b5563;
                            margin-bottom: 1.5rem;
                            background-color: white;
                            padding: 0.75rem;
                            border-radius: 0.5rem;
                            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
                            border: 1px solid #dbeafe;
                        `}
                    >
                        <p
                            css={css`
                                margin-bottom: 0.25rem;
                                font-style: italic;
                                color: #1e40af;
                                font-weight: 500;
                            `}
                        >
                            사진에 담긴 추억을 공유해보세요
                        </p>

                        <p
                            css={css`
                                display: flex;
                                align-items: center;
                                margin-bottom: 0.25rem;
                            `}
                        >
                            <span
                                css={css`
                                    width: 4px;
                                    height: 4px;
                                    border-radius: 50%;
                                    background-color: #60a5fa;
                                    margin-right: 0.5rem;
                                `}
                            ></span>
                            같은 순간의 사진들은 하나의 특별한 기억으로 저장됩니다
                        </p>

                        <p
                            css={css`
                                display: flex;
                                align-items: center;
                                margin-bottom: 0.25rem;
                            `}
                        >
                            <span
                                css={css`
                                    width: 4px;
                                    height: 4px;
                                    border-radius: 50%;
                                    background-color: #60a5fa;
                                    margin-right: 0.5rem;
                                `}
                            ></span>
                            날짜와 장소 정보는 나중에도 추가할 수 있어요
                        </p>

                        <p
                            css={css`
                                display: flex;
                                align-items: center;
                            `}
                        >
                            <span
                                css={css`
                                    width: 4px;
                                    height: 4px;
                                    border-radius: 50%;
                                    background-color: #60a5fa;
                                    margin-right: 0.5rem;
                                `}
                            ></span>
                            사진 속 순간들이 모여 당신만의 여행 스토리가 됩니다
                        </p>
                    </div>

                    <div
                        css={css`
                            flex: 1;
                            border: 2px dashed #bfdbfe;
                            border-radius: 0.5rem;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            padding: 1.5rem;
                            cursor: pointer;
                            background-color: rgba(255, 255, 255, 0.7);
                            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
                            transition: all 0.3s ease;

                            &:hover {
                                background-color: #eff6ff;
                            }
                        `}
                        // onClick={simulateUpload}
                    >
                        <div
                            css={css`
                                background-color: #dbeafe;
                                padding: 1rem;
                                border-radius: 9999px;
                                margin-bottom: 1rem;
                                box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
                            `}
                        >
                            <Upload
                                css={css`
                                    width: 2.5rem;
                                    height: 2.5rem;
                                    color: ${COLORS.PRIMARY};
                                `}
                            />
                        </div>

                        <p
                            css={css`
                                font-size: 1.125rem;
                                font-weight: 500;
                                margin-bottom: 0.5rem;
                                color: #1e3a8a;
                            `}
                        >
                            소중한 순간을 공유해주세요
                        </p>

                        <p
                            css={css`
                                color: #4b5563;
                                font-size: 0.875rem;
                                text-align: center;
                                margin-bottom: 1.5rem;
                                line-height: 1.5;
                            `}
                        >
                            당신의 발자취가 담긴 사진들로
                            <br />
                            잊지 못할 여행 이야기를 만들어 드립니다
                        </p>

                        <div
                            css={css`
                                position: relative;
                            `}
                        >
                            <button
                                css={css`
                                    background: linear-gradient(to right, #2563eb, #4f46e5);
                                    color: white;
                                    padding: 0.75rem 2rem;
                                    border-radius: 0.5rem;
                                    font-weight: 500;
                                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                                    transition: all 0.3s ease;
                                    display: flex;
                                    align-items: center;

                                    &:hover {
                                        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
                                    }
                                `}
                            >
                                <MapPin
                                    css={css`
                                        width: 1rem;
                                        height: 1rem;
                                        margin-right: 0.5rem;
                                    `}
                                />
                                추억 선택하기
                            </button>

                            <div
                                css={css`
                                    position: absolute;
                                    top: -0.5rem;
                                    right: -0.5rem;
                                    width: 1.25rem;
                                    height: 1.25rem;
                                    background-color: #ec4899;
                                    border-radius: 9999px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                                `}
                            >
                                <Heart
                                    css={css`
                                        width: 0.75rem;
                                        height: 0.75rem;
                                        color: white;
                                    `}
                                />
                            </div>
                        </div>
                    </div>

                    <div
                        css={css`
                            margin-top: 1rem;
                            text-align: center;
                            font-size: 0.75rem;
                            color: #6b7280;
                            font-style: italic;
                        `}
                    >
                        "사진은 언어보다 때로는 더 많은 이야기를 담습니다"
                    </div>
                </div>
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
            {isUploadModalOpen && (
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
            )}
        </div>
    );
};

const alertStyle = css`
    h1 {
        text-align: center;
        font-size: 18px;
        font-weight: 600;
        color: #181818;
        margin-top: 24px;
        margin-bottom: 20px;
    }

    div {
        font-size: 16px;
        margin: 0 26px 34px 26px;
        text-align: center;
        color: ${theme.COLORS.TEXT.DESCRIPTION};
        line-height: 20px;
    }

    p {
        margin-top: 12px;
    }
`;

const countStyle = css`
    font-size: 18px;
    font-weight: 600;
    margin: 0 4px;
    color: ${theme.COLORS.PRIMARY};
`;

const page = css`
    height: 100dvh;
    display: flex;
    flex-direction: column;
`;

const mainStyle = css`
    flex: 1;
    /* padding: 20px; */
    display: flex;
    flex-direction: column;
`;

const sectionStyle = css`
    flex: 1;
    display: flex;
    flex-direction: column;

    h2 {
        font-size: 18px;
        font-weight: bold;
    }

    h4 {
        font-size: 14px;
        color: ${theme.COLORS.TEXT.BLACK};
        font-weight: 600;
        margin-bottom: 14px;
    }

    p {
        font-size: 12px;
        color: ${theme.COLORS.TEXT.DESCRIPTION};
        margin-bottom: 10px;
        margin-left: 2px;
    }
`;

const uploadAreaStyle = css`
    height: 140px;
    border: 2px dashed #ccc;
    border-radius: 8px;
    margin: 20px 0;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const fileInputStyle = css`
    display: none;
`;

const uploadLabelStyle = css`
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    color: ${theme.COLORS.TEXT.DESCRIPTION};
`;

const uploadedStyle = css`
    font-size: 16px;
    font-weight: bold;
`;

export default TripImageUploadPage;
