import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { ImageUp } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import Header from '@/components/common/Header';
import AlertModal from '@/components/features/guide/AlertModal';
import UploadingSpinner from '@/components/features/guide/UploadingSpinner';
import { ROUTES } from '@/constants/paths';
import { TRIP_IMAGES_UPLOAD } from '@/constants/ui/message';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useToastStore } from '@/stores/useToastStore';
import { useUploadStore } from '@/stores/useUploadingStore';
import useUserDataStore from '@/stores/useUserDataStore';
import theme from '@/styles/theme';

const TripImageUploadPage = () => {
    const [isUploading, setIsUploading] = useState(false);

    const isTripInfoEditing = useUserDataStore((state) => state.isTripInfoEditing);
    const setIsTripInfoEditing = useUserDataStore((state) => state.setIsTripInfoEditing);
    const waitForCompletion = useUploadStore((state) => state.waitForCompletion);
    const resetUpload = useUploadStore((state) => state.resetUpload);
    const showToast = useToastStore((state) => state.showToast);

    const {
        tripId,
        imageCount,
        imagesWithLocationAndDate,
        imagesNoLocationWithDate,
        imagesNoDate,
        isExtracting,
        isAlertModalOpen,
        setIsAlertModalModalOpen,
        handleImageProcess,
        uploadImages,
    } = useImageUpload();

    const navigate = useNavigate();
    const location = useLocation();
    const isFirstTicket = Boolean(location.state);

    useEffect(() => {
        resetUpload();
    }, []);

    const navigateBeforePage = () => {
        isTripInfoEditing && setIsTripInfoEditing(false);
        navigate(
            isFirstTicket
                ? ROUTES.PATH.MAIN
                : isTripInfoEditing
                  ? ROUTES.PATH.TRIPS.IMAGES(Number(tripId))
                  : ROUTES.PATH.TRIPS.ROOT,
        );
    };

    const closeAlertModal = async () => {
        if (imagesNoLocationWithDate.length || imagesWithLocationAndDate.length) {
            const imageFile = [...imagesNoLocationWithDate, ...imagesWithLocationAndDate];
            uploadImages(imageFile);
            setIsAlertModalModalOpen(false);

            if (isTripInfoEditing) {
                setIsUploading(true);
                await waitForCompletion();
                setIsUploading(true);

                navigate(`${ROUTES.PATH.TRIPS.ROOT}`);
                showToast(`${imageFile.length}장의 사진이 등록되었습니다.`);
                setIsTripInfoEditing(false);
                return;
            }

            const imageDates = imageFile.map((image) => image.formattedDate.split('T')[0]);
            const uniqueDates = Array.from(new Set(imageDates)).sort(
                (dateA, dateB) => new Date(dateA).getTime() - new Date(dateB).getTime(),
            );

            navigate(`${ROUTES.PATH.TRIPS.NEW.INFO(Number(tripId))}`, { state: uniqueDates });
            return;
        } else {
            setIsAlertModalModalOpen(false);
            showToast('등록 가능한 사진이 없습니다.');
        }
    };

    return (
        <div css={containerStyle}>
            <Header title={'사진 등록'} isBackButton onBack={navigateBeforePage} />
            <main css={mainStyle}>
                <section css={sectionStyle}>
                    <h4>[사진 등록 가이드]</h4>
                    <p>1. 중복된 사진들의 경우, 1장으로 등록됩니다.</p>
                    <p>2. 위치 정보가 없는 사진은 직접 위치를 등록하실 수 있습니다.</p>
                    <p>3. 날짜 정보가 없는 사진은 등록하실 수 없습니다.</p>

                    <div css={uploadAreaStyle}>
                        <input
                            type='file'
                            accept='image/*,.heic'
                            multiple
                            onChange={(e) => handleImageProcess(e.target.files)}
                            css={fileInputStyle}
                            id='imageUpload'
                        />
                        {!isExtracting ? (
                            <label htmlFor='imageUpload' css={uploadLabelStyle}>
                                <ImageUp size={32} />
                                <span css={uploadedStyle}>{TRIP_IMAGES_UPLOAD.message}</span>
                            </label>
                        ) : (
                            <label htmlFor='imageUpload' css={uploadLabelStyle}>
                                <ClipLoader color='#5e5e5e' size={25} speedMultiplier={0.7} />
                                <h3 css={uploadedStyle}>사진에서 위치, 날짜 정보를 찾고 있습니다.</h3>
                            </label>
                        )}
                    </div>
                </section>
            </main>
            {isAlertModalOpen && (
                <AlertModal confirmText='사진 등록하기' confirmModal={closeAlertModal}>
                    <div css={alertStyle}>
                        <h1>
                            총 <span css={countStyle}>{imageCount}</span> 개의 이미지를 선택했습니다.
                        </h1>
                        <div>
                            <p>등록 가능한 사진 ✅ : {imagesWithLocationAndDate.length} 개</p>
                            <p>위치정보가 없어요 ✳️ : {imagesNoLocationWithDate.length} 개</p>
                            <p>날짜정보가 없어요 ❌ : {imagesNoDate.length} 개</p>
                        </div>
                    </div>
                </AlertModal>
            )}
            {isUploading && <UploadingSpinner />}
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

const containerStyle = css`
    height: 100dvh;
    display: flex;
    flex-direction: column;
`;

const mainStyle = css`
    flex: 1;
    padding: 20px;
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
    gap: 18px;
    color: ${theme.COLORS.TEXT.DESCRIPTION};
`;

const uploadedStyle = css`
    font-size: 16px;
    font-weight: bold;
`;

export default TripImageUploadPage;
