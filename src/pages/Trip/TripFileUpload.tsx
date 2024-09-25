import { css } from '@emotion/react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/common/button/Button';
import Header from '@/components/layout/Header';
import { PATH } from '@/constants/path';
import { PAGE } from '@/constants/title';
import { useFileUpload } from '@/hooks/useFileUpload';

const TripFileUpload = () => {
    const { imagesWithLocation, imagesNoLocation, handleFileUpload, uploadTripImages } = useFileUpload();

    const navigate = useNavigate();

    // useEffect(() => {
    //     if (imagesNoLocation) {
    //         sessionStorage.setItem('images', JSON.stringify(imagesNoLocation));
    //     }
    // }, [imagesNoLocation]);

    const goToAddLocation = () => {
        navigate(PATH.TRIP_UPLOAD_ADD_LOCATION, { state: { imagesNoLocation } });
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
                {imagesNoLocation.length > 0 && (
                    <Button text='위치 넣기' theme='pri' size='sm' onClick={goToAddLocation} />
                )}
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
