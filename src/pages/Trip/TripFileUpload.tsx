import { useEffect } from 'react';

import { css } from '@emotion/react';
import { ImageUp, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/common/button/Button';
import AlertModal from '@/components/common/modal/AlertModal';
import GuideModal from '@/components/common/modal/GuideModal';
import Toast from '@/components/common/Toast';
import Header from '@/components/layout/Header';
import NoDataImageContent from '@/components/pages/image-upload/NoDataImageContent';
import { TRIP_IMAGES_UPLOAD } from '@/constants/message';
import { PATH } from '@/constants/path';
import { PAGE } from '@/constants/title';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useToastStore } from '@/stores/useToastStore';
import theme from '@/styles/theme';

const TripFileUpload = () => {
    const {
        imageCount,
        imagesWithLocationAndDate,
        imagesNoLocationWithDate,
        imagesNoDate,
        isProcessing,
        isAlertModalOpen,
        isInvalid,
        isAddLocationModalOpen,
        setIsInvalid,
        setIsAlertModalModalOpen,
        // isUploading,
        handleImageProcess,
        setIsAddLocationModalOpen,
    } = useImageUpload();

    const showToast = useToastStore((state) => state.showToast);

    const navigate = useNavigate();

    useEffect(() => {
        const tripId = localStorage.getItem('tripId');
        if (!tripId) {
            navigate(PATH.TRIP_LIST);
            return;
        }
    }, []);

    const navigateToImageLocation = () => {
        setIsAddLocationModalOpen(false);

        if (imagesWithLocationAndDate.length !== 0) {
            const defaultLocation = imagesWithLocationAndDate[0].location;
            navigate(PATH.TRIP_UPLOAD_ADD_LOCATION, { state: { defaultLocation, imagesNoLocationWithDate } });
        } else {
            const defaultLocation = { latitude: 37.5665, longitude: 126.978 };
            navigate(PATH.TRIP_UPLOAD_ADD_LOCATION, { state: { defaultLocation, imagesNoLocationWithDate } });
        }
    };

    const navigateToTripInfo = () => {
        setIsAddLocationModalOpen(false);
        navigate(PATH.TRIP_NEW);
    };

    const closeAlertModal = () => {
        if (imagesNoLocationWithDate.length) {
            setIsAlertModalModalOpen(false);
            setIsAddLocationModalOpen(true);
            return;
        } else if (imagesWithLocationAndDate.length) {
            setIsAlertModalModalOpen(false);
            navigate(PATH.TRIP_NEW);
            return;
        } else {
            setIsAlertModalModalOpen(false);
            showToast('등록 가능한 사진이 없습니다.');
            setIsInvalid(true);
        }
    };

    return (
        <div css={containerStyle}>
            <Header title={PAGE.UPLOAD_IMAGES} isBackButton onBack={() => navigate(PATH.TRIP_LIST)} />
            <main css={mainStyle}>
                <section css={sectionStyle}>
                    <h4>[사진 등록 가이드]</h4>
                    <p>1. 위치 정보가 없는 사진은 직접 위치를 등록하실 수 있습니다.</p>
                    <p>2. 날짜 정보가 없는 사진은 등록하실 수 없습니다.</p>
                    <p>3. 중복된 사진들의 경우, 1장으로 등록됩니다.</p>

                    <div css={uploadAreaStyle}>
                        <input
                            type='file'
                            accept='image/*,.heic'
                            multiple
                            onChange={(e) => handleImageProcess(e.target.files)}
                            css={fileInputStyle}
                            id='imageUpload'
                        />
                        {!isProcessing ? (
                            <label htmlFor='imageUpload' css={uploadLabelStyle}>
                                <ImageUp size={32} />
                                <span css={uploadedStyle}>{TRIP_IMAGES_UPLOAD.message}</span>
                            </label>
                        ) : (
                            <label htmlFor='imageUpload' css={uploadLabelStyle}>
                                <h3 css={uploadedStyle}>사진에서 위치, 날짜 정보를 찾고 있습니다.</h3>
                            </label>
                            // <label htmlFor='imageUpload' css={uploadLabelStyle}>
                            //     <Image size={32} />
                            //     <h3 css={uploadedStyle}>
                            //         총 <span css={countStyle}>{imageCount}</span>개의 이미지를 선택하셨습니다.
                            //     </h3>
                            // </label>
                        )}
                    </div>
                    {/* {imageCount !== 0 && (
                        <>
                            <h4>{`${imageCount} 개의 이미지 중,`}</h4>
                            <p>등록 가능 사진 : {imagesWithLocationAndDate.length} 개</p>
                            <p>위치 정보 ❎ : {imagesNoLocationWithDate.length} 개 (직접 등록 가능)</p>
                            <p>날짜 정보 ❎ : {imagesNoDate.length} 개</p>
                        </>
                    )} */}
                </section>
                {/* <Button
                    text='등록하기'
                    btnTheme='pri'
                    size='lg'
                    onClick={uploadImages}
                    disabled={
                        imageCount === 0 ||
                        (imagesNoLocationWithDate.length === 0 &&
                            imagesWithLocationAndDate.length === 0 &&
                            imagesNoLocationWithDate.length === 0)
                    }
                /> */}
            </main>
            {/* {isResizing && <ResizingSpinner earliestDate={earliestDate} latestDate={latestDate} />} */}
            {isAlertModalOpen && (
                <AlertModal buttonText='다음' closeModal={closeAlertModal} isOverlay>
                    <div>
                        <h4>{`${imageCount} 개의 이미지 중,`}</h4>
                        <p>등록 가능 사진 : {imagesWithLocationAndDate.length} 개</p>
                        <p>위치 정보 ❎ : {imagesNoLocationWithDate.length} 개 (직접 등록 가능)</p>
                        <p>날짜 정보 ❎ : {imagesNoDate.length} 개</p>
                    </div>
                </AlertModal>
            )}
            {isAddLocationModalOpen && (
                <GuideModal
                    confirmText='등록하기'
                    cancelText='건너뛰기'
                    confirmModal={navigateToImageLocation}
                    closeModal={navigateToTripInfo}
                    isOverlay
                >
                    <NoDataImageContent noLocationCount={imagesNoLocationWithDate.length} />
                </GuideModal>
            )}
            <Toast />
        </div>
    );
};

const countStyle = css`
    font-size: 18px;
    font-weight: 600;
    margin: 0 4px;
    color: ${theme.colors.primary};
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
        color: ${theme.colors.black};
        font-weight: 600;
        margin-bottom: 14px;
    }

    p {
        font-size: 12px;
        color: ${theme.colors.descriptionText};
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
    color: ${theme.colors.descriptionText};
`;

const uploadedStyle = css`
    font-size: 16px;
    font-weight: bold;
`;

export default TripFileUpload;
