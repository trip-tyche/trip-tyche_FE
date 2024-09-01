import React, { useState } from 'react';

import { css } from '@emotion/react';
import axios from 'axios';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/common/Button/Button';
import Header from '@/components/layout/Header/Header';

const TripFile: React.FC = () => {
    const [images, setImages] = useState<File[]>([]);
    const [voices, setVoices] = useState<File[]>([]);
    const [memos, setMemos] = useState<File[]>([]);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const navigate = useNavigate();

    const handleFileUpload = async (files: FileList, type: 'images' | 'voices' | 'memos') => {
        const formData = new FormData();
        Array.from(files).forEach((file) => {
            formData.append(type, file);
        });

        try {
            const response = await axios.post(`/server/postTripsFile.json`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                setToast({ message: '파일이 성공적으로 업로드되었습니다.', type: 'success' });
                switch (type) {
                    case 'images':
                        setImages((prev) => [...prev, ...Array.from(files)]);
                        break;
                    case 'voices':
                        setVoices((prev) => [...prev, ...Array.from(files)]);
                        break;
                    case 'memos':
                        setMemos((prev) => [...prev, ...Array.from(files)]);
                        break;
                }
            }
        } catch (error) {
            console.error('File upload failed:', error);
            setToast({ message: '파일 업로드에 실패했습니다.', type: 'error' });
        }
    };

    const handleComplete = () => {
        // 완료 로직 구현
        navigate('/trips');
    };

    return (
        <div css={containerStyle}>
            <Header title='여행 등록' isBackButton={true} onClick={() => navigate(-1)} />

            <main css={mainStyle}>
                <section css={sectionStyle}>
                    <h2>Images</h2>
                    <div css={uploadAreaStyle}>
                        <input
                            type='file'
                            accept='image/*'
                            multiple
                            onChange={(e) => handleFileUpload(e.target.files!, 'images')}
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

                <section css={sectionStyle}>
                    <h2>Voices</h2>
                    <div css={uploadAreaStyle}>
                        <input
                            type='file'
                            accept='audio/*'
                            multiple
                            onChange={(e) => handleFileUpload(e.target.files!, 'voices')}
                            css={fileInputStyle}
                            id='voiceUpload'
                        />
                        <label htmlFor='voiceUpload' css={uploadLabelStyle}>
                            <FaCloudUploadAlt size={40} />
                            <span>Drag and drop files or click to upload</span>
                        </label>
                        {voices.length > 0 && <div css={countStyle}>+ {voices.length}</div>}
                    </div>
                </section>

                <section css={sectionStyle}>
                    <h2>Memos</h2>
                    <div css={uploadAreaStyle}>
                        <input
                            type='file'
                            accept='.txt'
                            multiple
                            onChange={(e) => handleFileUpload(e.target.files!, 'memos')}
                            css={fileInputStyle}
                            id='memoUpload'
                        />
                        <label htmlFor='memoUpload' css={uploadLabelStyle}>
                            <FaCloudUploadAlt size={40} />
                            <span>Drag and drop files or click to upload</span>
                        </label>
                        {memos.length > 0 && <div css={countStyle}>+ {memos.length}</div>}
                    </div>
                </section>
            </main>

            <div css={submitButtonStyle}>
                <Button text='완료' theme='sec' size='sm' onClick={handleComplete} />
            </div>

            {toast && (
                <div css={[toastStyle, toast.type === 'error' ? errorToastStyle : successToastStyle]}>
                    {toast.message}
                </div>
            )}
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

export default TripFile;
