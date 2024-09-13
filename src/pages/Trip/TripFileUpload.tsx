import React, { useState } from 'react';

import { css } from '@emotion/react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

import { postTripImages } from '@/api/trips';
import Button from '@/components/common/Button/Button';
import Header from '@/components/layout/Header';

const TripFileUpload: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [images, setImages] = useState<File[]>([]);

    const { tripId, tripTitle } = location.state;
    const handleFileUpload = (files: FileList | null) => {
        if (files) setImages(Array.from(files));
    };
    console.log(tripId, tripTitle);
    const uploadTripImages = async () => {
        await postTripImages(tripId, images);
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
// import React, { useState } from 'react';

// import { css } from '@emotion/react';
// import { FaCloudUploadAlt } from 'react-icons/fa';
// import { useLocation, useNavigate } from 'react-router-dom';

// import { postTripImages } from '@/api/trips';
// import Button from '@/components/common/Button/Button';
// import Header from '@/components/layout/Header';

// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
// const MAX_FILES = 10;

// const TripFileUpload: React.FC = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const [images, setImages] = useState<File[]>([]);
//     const [error, setError] = useState<string | null>(null);
//     const [success, setSuccess] = useState<string | null>(null);
//     const { tripId, tripTitle } = location.state;

//     const handleFileUpload = (files: FileList | null) => {
//         if (files) {
//             const newFiles = Array.from(files);
//             if (newFiles.length > MAX_FILES) {
//                 setError(`최대 ${MAX_FILES}개의 파일만 업로드할 수 있습니다.`);
//                 return;
//             }
//             const oversizedFiles = newFiles.filter((file) => file.size > MAX_FILE_SIZE);
//             if (oversizedFiles.length > 0) {
//                 setError(`${oversizedFiles.map((f) => f.name).join(', ')} 파일이 5MB를 초과합니다.`);
//                 return;
//             }
//             setImages((prevImages) => [...prevImages, ...newFiles]);
//             setError(null);
//         }
//     };

//     const uploadTripImages = async () => {
//         try {
//             setError(null);
//             setSuccess(null);
//             await postTripImages(tripId, images);
//             setSuccess('이미지가 성공적으로 업로드되었습니다.');
//             setTimeout(() => navigate('/trips'), 2000);
//         } catch (err) {
//             setError('이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.');
//             console.error(err);
//         }
//     };

//     return (
//         <div css={containerStyle}>
//             <Header title='이미지 등록' isBackButton={true} onClick={() => navigate(-1)} />
//             <main css={mainStyle}>
//                 <section css={sectionStyle}>
//                     <h2>{`'${tripTitle}' 여행 이미지를 등록해주세요!`}</h2>
//                     <div css={uploadAreaStyle}>
//                         <input
//                             type='file'
//                             accept='image/*'
//                             multiple
//                             onChange={(e) => handleFileUpload(e.target.files)}
//                             css={fileInputStyle}
//                             id='imageUpload'
//                         />
//                         <label htmlFor='imageUpload' css={uploadLabelStyle}>
//                             <FaCloudUploadAlt size={40} />
//                             <span>파일을 드래그하거나 클릭하여 업로드하세요</span>
//                             <span>최대 {MAX_FILES}개, 각 5MB 이하</span>
//                         </label>
//                         {images.length > 0 && <div css={countStyle}>+ {images.length}</div>}
//                     </div>
//                 </section>
//             </main>
//             <div css={submitButtonStyle}>
//                 <Button text='완료' theme='sec' size='sm' onClick={uploadTripImages} />
//             </div>
//             {error && <div css={[toastStyle, errorToastStyle]}>{error}</div>}
//             {success && <div css={[toastStyle, successToastStyle]}>{success}</div>}
//         </div>
//     );
// };

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

const toastStyle = css`
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 20px;
    border-radius: 4px;
    color: white;
    font-weight: bold;
    z-index: 1000;
`;

const successToastStyle = css`
    background-color: #4caf50;
`;

const errorToastStyle = css`
    background-color: #f44336;
`;

export default TripFileUpload;
