import { css } from '@emotion/react';
import { ImageUp, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/common/button/Button';
import GuideModal from '@/components/common/modal/GuideModal';
import ModalOverlay from '@/components/common/modal/ModalOverlay';
import Header from '@/components/layout/Header';
import NoDataImageContent from '@/components/pages/image-upload/NoDataImageContent';
import UploadingSpinner from '@/components/pages/image-upload/UploadingSpinner';
import { TRIP_IMAGES_UPLOAD } from '@/constants/message';
import { PATH } from '@/constants/path';
import { PAGE } from '@/constants/title';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useModalStore } from '@/stores/useModalStore';
import theme from '@/styles/theme';

const TripFileUpload = () => {
    const { isModalOpen, closeModal } = useModalStore();

    const {
        imageCount,
        imagesWithLocation,
        noDateImagesCount,
        imagesNoLocation,
        isLoading,
        isUploading,
        handleFileUpload,
        uploadTripImages,
    } = useImageUpload();

    const noDataImagesCount = noDateImagesCount + imagesNoLocation.length;

    const navigate = useNavigate();

    const goToAddLocation = async () => {
        closeModal();
        if (imagesWithLocation.length) {
            const defaultLocation = imagesWithLocation[0].location;
            navigate(PATH.TRIP_UPLOAD_ADD_LOCATION, { state: { defaultLocation, imagesNoLocation } });
        } else {
            // 모든 정보가 위치가 없다면? 기본값 설정하기
        }
    };
    const ignoreAddLocation = () => {
        closeModal();
        navigate(PATH.TRIP_LIST);
    };

    return (
        <div css={containerStyle}>
            <Header title={PAGE.UPLOAD_IMAGES} isBackButton />
            <main css={mainStyle}>
                <section css={sectionStyle}>
                    <h2>{TRIP_IMAGES_UPLOAD.title}</h2>
                    <p>여행 기간 외 사진은 등록되지 않습니다</p>
                    <div css={uploadAreaStyle}>
                        <input
                            type='file'
                            accept='image/*,.heic'
                            multiple
                            onChange={(e) => handleFileUpload(e.target.files)}
                            css={fileInputStyle}
                            id='imageUpload'
                        />
                        {!imageCount ? (
                            <label htmlFor='imageUpload' css={uploadLabelStyle}>
                                <ImageUp size={36} />
                                <span>{TRIP_IMAGES_UPLOAD.message}</span>
                            </label>
                        ) : (
                            <label htmlFor='imageUpload' css={uploadLabelStyle}>
                                <Image size={36} />
                                <h3 css={uploadedStyle}>
                                    총 <span css={countStyle}>{imageCount}</span>개의 이미지를 선택하셨습니다.
                                </h3>
                            </label>
                        )}
                    </div>
                </section>
                <div css={buttonWrapperStyle}>
                    <Button
                        text='등록하기'
                        btnTheme='pri'
                        size='lg'
                        onClick={uploadTripImages}
                        disabled={imageCount === 0}
                        isLoading={isLoading}
                    />
                </div>
            </main>
            {isModalOpen && (
                <GuideModal
                    confirmText='다음'
                    cancelText='취소'
                    confirmModal={goToAddLocation}
                    closeModal={ignoreAddLocation}
                    isOverlay
                >
                    {noDataImagesCount !== 0 && <NoDataImageContent noDataImagesCount={noDataImagesCount} />}
                </GuideModal>
            )}
            {isUploading && <UploadingSpinner />}
        </div>
    );
};

const countStyle = css`
    font-size: 18px;
    font-weight: 600;
    margin: 0 4px;
    color: #0073bb;
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
    /* gap: 30px; */
    h2 {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 8px;
    }
    p {
        font-size: 12px;
        color: ${theme.colors.descriptionText};
        margin-bottom: 24px;
        margin-left: 2px;
    }
    margin-bottom: 70px;
`;

const uploadAreaStyle = css`
    height: 140px;
    border: 2px dashed #ccc;
    border-radius: 8px;
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
    color: #666;
`;

const uploadedStyle = css`
    font-size: 16px;
    font-weight: bold;
`;

const buttonWrapperStyle = css`
    margin-bottom: 40px;
`;

export default TripFileUpload;
