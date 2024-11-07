import { css } from '@emotion/react';
import { ImageUp } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import AlertModal from '@/components/common/modal/AlertModal';
import GuideModal from '@/components/common/modal/GuideModal';
import Toast from '@/components/common/Toast';
import Header from '@/components/layout/Header';
import ModalContent from '@/components/pages/image-upload/ModalContent';
import { TRIP_IMAGES_UPLOAD } from '@/constants/message';
import { PATH } from '@/constants/path';
import { PAGE } from '@/constants/title';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useEditingStore } from '@/stores/useEditingStore';
import { useToastStore } from '@/stores/useToastStore';
import theme from '@/styles/theme';

const TripFileUpload = () => {
    const {
        tripId,
        imageCount,
        imagesWithLocationAndDate,
        imagesNoLocationWithDate,
        imagesNoDate,
        isExtracting,
        isResizing,
        resizingProgress,
        isAlertModalOpen,
        isAddLocationModalOpen,
        setIsAlertModalModalOpen,
        handleImageProcess,
        setIsAddLocationModalOpen,
        uploadImages,
    } = useImageUpload();

    const showToast = useToastStore((state) => state.showToast);
    const { isEditing, setIsEditing } = useEditingStore();

    const navigate = useNavigate();
    const location = useLocation();
    const isFirstReg = location.state;

    const navigateToImageLocation = () => {
        setIsAddLocationModalOpen(false);

        if (imagesWithLocationAndDate.length !== 0) {
            const defaultLocation = imagesWithLocationAndDate[0].location;
            navigate(`${PATH.TRIP_UPLOAD_ADD_LOCATION}/${tripId}`, {
                state: { defaultLocation, imagesNoLocationWithDate },
            });
        } else {
            const defaultLocation = { latitude: 37.5665, longitude: 126.978 };
            navigate(`${PATH.TRIP_UPLOAD_ADD_LOCATION}/${tripId}`, {
                state: { defaultLocation, imagesNoLocationWithDate },
            });
        }
    };

    const navigateToTripInfo = () => {
        if (isEditing) {
            navigate(`${PATH.TRIP_LIST}`);
            showToast(`${imagesWithLocationAndDate.length}장의 사진이 등록되었습니다.`);
            setIsEditing(false);
        } else {
            setIsAddLocationModalOpen(false);
            navigate(`${PATH.TRIP_NEW}/${tripId}`);
        }
    };

    const closeAlertModal = () => {
        if (imagesNoLocationWithDate.length) {
            setIsAlertModalModalOpen(false);
            uploadImages(imagesWithLocationAndDate);
            setIsAddLocationModalOpen(true);
            return;
        } else if (imagesWithLocationAndDate.length) {
            setIsAlertModalModalOpen(false);
            uploadImages(imagesWithLocationAndDate);

            if (isEditing) {
                navigate(`${PATH.TRIP_LIST}`);
                showToast(`${imagesWithLocationAndDate.length}장의 사진이 등록되었습니다.`);
                setIsEditing(false);
            } else {
                navigate(`${PATH.TRIP_NEW}/${tripId}`);
            }

            return;
        } else {
            setIsAlertModalModalOpen(false);
            showToast('등록 가능한 사진이 없습니다.');
        }
    };

    return (
        <div css={containerStyle}>
            <Header
                title={PAGE.UPLOAD_IMAGES}
                isBackButton
                onBack={isFirstReg ? () => navigate(PATH.HOME) : () => navigate(PATH.TRIP_LIST)}
            />
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
                <AlertModal
                    buttonText='사진 등록하기'
                    closeModal={closeAlertModal}
                    isOverlay
                    isDisable={isResizing}
                    progress={resizingProgress}
                >
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
            {isAddLocationModalOpen && (
                <GuideModal
                    confirmText='설정하기'
                    cancelText='건너뛰기'
                    confirmModal={navigateToImageLocation}
                    closeModal={navigateToTripInfo}
                    isOverlay
                >
                    <ModalContent noLocationImageCount={imagesNoLocationWithDate.length} />
                </GuideModal>
            )}
            <Toast />
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
        margin: 0 26px 38px 26px;
        text-align: center;
        color: ${theme.colors.descriptionText};
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
