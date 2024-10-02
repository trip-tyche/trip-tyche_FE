import { css } from '@emotion/react';
import { ImageUp, Image } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import Button from '@/components/common/button/Button';
import Loading from '@/components/common/Loading';
import Header from '@/components/layout/Header';
import { TRIP_IMAGES_UPLOAD } from '@/constants/message';
import { PATH } from '@/constants/path';
import { PAGE } from '@/constants/title';
import { useFileUpload } from '@/hooks/useFileUpload';

const TripFileUpload = () => {
    const { imageCount, imagesWithLocation, imagesNoLocation, isLoading, handleFileUpload, uploadTripImages } =
        useFileUpload();
    const navigate = useNavigate();

    const goToAddLocation = async () => {
        try {
            if (imagesWithLocation.length !== 0) {
                await uploadTripImages();
                const defaultLocation = imagesWithLocation[0].location;
                navigate(PATH.TRIP_UPLOAD_ADD_LOCATION, { state: { defaultLocation, imagesNoLocation } });
            }
        } catch (error) {
            console.error('Error post trip-images:', error);
        }
    };

    // if (!isLoading) {
    //     return <Loading />;
    // }
    return (
        <div css={containerStyle}>
            <Header title={PAGE.UPLOAD_IMAGES} isBackButton />

            <main css={mainStyle}>
                <section css={sectionStyle}>
                    <h2>{TRIP_IMAGES_UPLOAD.title}</h2>
                    <div css={uploadAreaStyle}>
                        {/* {imagesWithLocation.length > 0 && (
                            <div css={countStyle(true)}>+ {imagesWithLocation.length}</div>
                        )}
                        {imagesNoLocation.length > 0 && <div css={countStyle(false)}>+ {imagesNoLocation.length}</div>} */}
                        <input
                            type='file'
                            accept='image/*'
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
                <Button text='등록하기' theme='sec' size='full' onClick={uploadTripImages} isLoading={isLoading} />
            </main>

            {/* {imagesNoLocation.length > 0 && (
                    <Button text='위치 넣기' theme='pri' size='sm' onClick={goToAddLocation} />
                )} */}
        </div>
    );
};

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
    border: 2px dashed #ccc;
    border-radius: 4px;
    padding: 20px;
    text-align: center;
    position: relative;
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

// const submitButtonStyle = css`
//     color: white;
//     margin-top: 60px;
//     display: flex;
//     padding: 20px;
//     justify-content: flex-end;
// `;

export default TripFileUpload;
