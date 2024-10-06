import { css } from '@emotion/react';
import { ImageUp, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import loadingImage from '@/assets/images/flightLoading5.gif';
import Button from '@/components/common/button/Button';
import ModalOverlay from '@/components/common/modal/ModalOverlay';
import RowButtonModal from '@/components/common/modal/RowButtonModal';
import Header from '@/components/layout/Header';
import { TRIP_IMAGES_UPLOAD } from '@/constants/message';
import { PATH } from '@/constants/path';
import { PAGE } from '@/constants/title';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useModalStore } from '@/stores/useModalStore';

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

                <Button
                    text='등록하기'
                    theme='sec'
                    size='full'
                    onClick={uploadTripImages}
                    disabled={imageCount === 0}
                    isLoading={isLoading}
                />
            </main>
            {isModalOpen && (
                <>
                    <ModalOverlay />
                    <RowButtonModal
                        confirmText='직접 위치넣기'
                        cancelText='나중에'
                        confirmModal={ignoreAddLocation}
                        closeModal={goToAddLocation}
                        noDateImagesCount={noDateImagesCount}
                        imagesNoLocationCount={imagesNoLocation.length}
                    />
                </>
            )}
            {isUploading && (
                <>
                    <ModalOverlay />
                    <div css={modalStyle}>
                        <img src={loadingImage} />
                        <p>추억의 조각들을 저장 중입니다.</p>
                    </div>
                </>
            )}
        </div>
    );
};

const modalStyle = css`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    background-color: #fff;
    width: 360px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 14px;
    z-index: 1000;
    border: 2px solid #ccc;
    overflow: hidden;

    p {
        font-size: 16px;
        color: #666;
        font-weight: 600;
        text-align: center;
        margin: 12px 0;
    }
`;

const containerStyle = css`
    height: 100vh;
    display: flex;
    flex-direction: column;
`;

const mainStyle = css`
    padding: 20px;
`;

const sectionStyle = css`
    display: flex;
    flex-direction: column;
    gap: 30px;
    h2 {
        font-size: 18px;
        font-weight: bold;
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

const countStyle = css`
    font-size: 20px;
    font-weight: bold;
    margin: 0 4px;
`;

export default TripFileUpload;
