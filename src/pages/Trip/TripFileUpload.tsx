import React, { useState } from 'react';

import { css } from '@emotion/react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

import { postTripImages } from '@/api/trips';
import Button from '@/components/common/Button/Button';
import Header from '@/components/layout/Header';
import { getToken } from '@/utils/auth';

const TripFileUpload: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [images, setImages] = useState<File[]>([]);

    const { tripId, tripTitle } = location.state;
    const token = getToken();

    const handleFileUpload = (files: FileList | null) => {
        if (files) setImages(Array.from(files));
    };
    console.log(tripId, tripTitle);
    const uploadTripImages = async () => {
        await postTripImages(token, tripId, images);
        navigate('/trips');
    };

    return (
        <div css={containerStyle}>
            <Header title='이미지 등록' isBackButton={true} onClick={() => navigate(-1)} />

            <main css={mainStyle}>
                <section css={sectionStyle}>
                    <h2>{`'${tripTitle}' 여행 이미지를 등록해주세요!`}</h2>
                    <div css={uploadAreaStyle}>
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
                        {images.length > 0 && <div css={countStyle}>+ {images.length}</div>}
                    </div>
                </section>
            </main>

            <div css={submitButtonStyle}>
                <Button text='완료' theme='sec' size='sm' onClick={uploadTripImages} />
            </div>
        </div>
    );
};
const containerStyle = css``;

const mainStyle = css`
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
