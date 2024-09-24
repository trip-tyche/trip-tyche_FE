import { useState } from 'react';

import { css } from '@emotion/react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

import { postTripImages } from '@/api/trip';
import Button from '@/components/common/button/Button';
import Header from '@/components/layout/Header';
import { PATH } from '@/constants/path';
import { PAGE } from '@/constants/title';
import { ImageWithLocation } from '@/types/image';
import { getImageLocation } from '@/utils/piexif';

const TripFileUpload = () => {
    const [imagesWithLocation, setImagesWithLocation] = useState<ImageWithLocation[]>([]);

    const navigate = useNavigate();
    const location = useLocation();

    const { tripId, tripTitle } = location.state;

    console.log(tripId, tripTitle);

    const handleFileUpload = async (files: FileList | null) => {
        if (!files) {
            return;
        }

        try {
            const processedImages = await Promise.all(
                Array.from(files).map(async (file) => {
                    const location = await getImageLocation(file);
                    console.log(`Location for ${file.name}:`, location);
                    return { file, location };
                }),
            );

            const filteredImages = processedImages.filter((image) => image.location);

            console.log('Filtered images:', filteredImages);
            setImagesWithLocation(filteredImages);
        } catch (error) {
            console.error('Error processing files:', error);
        }
    };

    const uploadTripImages = async () => {
        try {
            const images = imagesWithLocation.map((image) => image.file);
            await postTripImages(tripId, images);
            navigate(PATH.TRIP_LIST);
        } catch (error) {
            console.error('Error post trip-images:', error);
        }
    };

    return (
        <div>
            <Header title={PAGE.UPLOAD_IMAGES} isBackButton />

            <div css={containerStyle}>
                <section css={sectionStyle}>
                    <h2>{`여행 이미지를 등록해주세요`}</h2>
                    <div css={uploadAreaStyle}>
                        {imagesWithLocation.length > 0 && <div css={countStyle}>+ {imagesWithLocation.length}</div>}
                        <input
                            type='file'
                            accept='image/*'
                            multiple
                            onChange={(e) => handleFileUpload(e.target.files)}
                            css={fileInputStyle}
                            id='imageUpload'
                        />
                        <label htmlFor='imageUpload' css={uploadLabelStyle}>
                            <FaCloudUploadAlt size={40} />
                            <span>Drag and drop files or click to upload</span>
                        </label>
                    </div>
                </section>
            </div>

            <div css={submitButtonStyle}>
                <Button text='완료' theme='sec' size='sm' onClick={uploadTripImages} />
            </div>
        </div>
    );
};

const containerStyle = css`
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 30px;
`;

const sectionStyle = css`
    display: flex;
    flex-direction: column;
    gap: 14px;
    h2 {
        font-size: 18px;
        font-weight: bold;
    }
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
    gap: 10px;
    color: #666;
`;

const countStyle = css`
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 16px;
    font-weight: bold;
    color: #4caf50;
`;

const submitButtonStyle = css`
    color: white;
    margin-top: 60px;
    display: flex;
    padding: 20px;
    justify-content: flex-end;
`;

export default TripFileUpload;
